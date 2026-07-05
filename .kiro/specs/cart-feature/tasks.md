# Implementation Plan: Cart Feature

## Overview

Wire up a shared cart state using React Context + localStorage persistence. Work proceeds
bottom-up: types → context + pure logic → provider registration → consumer pages → Navbar badge.
Property-based tests (fast-check) are added as sub-tasks immediately after each pure-logic step so
bugs are caught early.

---

## Tasks

- [x] 1. Define CartItem type and variant helpers in `types/cart.ts`
  - Replace the empty file with the `CartItem` interface (fields: `id`, `productId`, `name`,
    `price`, `image`, `selectedVariants`, `quantity`, `store`).
  - Add and export `formatVariants(selectedVariants: Record<string, string>): string` — joins
    entries as `"Key: Value"` separated by `", "`.
  - Add and export `variantKey(selectedVariants: Record<string, string>): string` — stable
    JSON stringify with sorted keys, used for duplicate detection.
  - _Requirements: 1.1, 1.3_

- [ ]* 1.1 Write property test for `formatVariants`
  - Install fast-check as a dev dependency: `npm install --save-dev fast-check`.
  - Create `__tests__/cart/formatVariants.test.ts`.
  - Use `fc.dictionary(fc.string({minLength:1}), fc.string())` to generate random variant maps.
  - Assert every key and value appears in the output string, and entries are separated by `", "`.
  - **Property 1: Variant display string contains all entries**
  - **Validates: Requirements 1.3, 5.5**

- [x] 2. Implement the cart reducer (pure function)
  - Create `contexts/cartReducer.ts` (no `"use client"` needed — pure TypeScript).
  - Define `CartAction` discriminated union:
    `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`.
  - `ADD_ITEM`: if an item with the same `productId` + `variantKey` exists, increment its
    `quantity`; otherwise push a new item with `id = crypto.randomUUID()`.
  - `REMOVE_ITEM`: filter by `cartItemId`.
  - `UPDATE_QUANTITY`: if `quantity < 1` remove the item; otherwise update in place.
  - `CLEAR_CART`: return `[]`.
  - _Requirements: 2.3, 2.4, 2.5_

- [ ]* 2.1 Write property tests for cart reducer
  - Create `__tests__/cart/cartReducer.test.ts`.
  - **Property 3: addToCart duplicate increments quantity, not count** — generate a cart with an
    existing item, dispatch `ADD_ITEM` with the same `productId`+`selectedVariants`, assert item
    count unchanged and quantity incremented. **Validates: Requirements 2.4**
  - **Property 4: totalItems equals sum of all quantities** — after any sequence of actions,
    sum of `quantity` in returned state must equal a separately computed sum. **Validates:
    Requirements 2.6**
  - **Property 5: updateQuantity < 1 removes the item** — generate a cart, pick a random item,
    dispatch `UPDATE_QUANTITY` with `quantity = 0`, assert that item is absent. **Validates:
    Requirements 2.5**
  - **Property 6: Delete All removes exactly the selected items** — generate a cart and a random
    subset of IDs, dispatch `REMOVE_ITEM` for each, assert none of those IDs remain and all other
    items are intact. **Validates: Requirements 4.4**

- [x] 3. Create `CartContext` and `CartProvider` in `contexts/CartContext.tsx`
  - Add `"use client"` directive.
  - Create `CartContext` with `createContext<CartContextValue | null>(null)`.
  - `CartProvider` uses `useReducer(cartReducer, [], init)` where `init()` reads
    `localStorage.getItem("crafties_cart")` inside a `typeof window !== "undefined"` guard;
    wrap in `try/catch` returning `[]` on error.
  - `useEffect` syncs state to `localStorage` on every state change; guard with
    `typeof window !== "undefined"` and wrap `setItem` in `try/catch`.
  - Derive `totalItems = items.reduce((s, i) => s + i.quantity, 0)`.
  - Export `useCart()` hook that reads `CartContext` and throws if `null`.
  - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7_

- [ ]* 3.1 Write property test for localStorage round-trip
  - Create `__tests__/cart/localStorage.test.ts`.
  - Mock `localStorage` with a `Map`-backed fake.
  - Generate random `CartItem[]` arrays, call the serialization path, then the deserialization
    path, assert structural equality.
  - **Property 2: localStorage round-trip preserves cart**
  - **Validates: Requirements 2.1, 2.2**

- [x] 4. Register `CartProvider` in `app/layout.tsx`
  - Import `CartProvider` from `@/contexts/CartContext`.
  - Wrap `{children}` with `<CartProvider>` inside the existing `<ThemeProvider>` so the tree is:
    `<ThemeProvider><CartProvider>{children}</CartProvider></ThemeProvider>`.
  - `app/layout.tsx` remains a Server Component; no `"use client"` needed there.
  - _Requirements: 2.8_

- [x] 5. Checkpoint — verify context builds without errors
  - Ensure `npm run build` (or `tsc --noEmit`) succeeds with no TypeScript errors after the above
    changes. Ask the user if questions arise.

- [x] 6. Wire up `app/products/[id]/page.tsx`
  - Import `useCart` from `@/contexts/CartContext`.
  - Destructure `addToCart` from `useCart()`.
  - Replace the local `handleAddToCart` stub: call `addToCart({ productId: product.id, name:
    product.product.name, price: product.product.price, image: product.images[0], store:
    product.product.badge, selectedVariants, quantity: qty })`, then set the `addedToCart` flag
    and the 2500 ms timeout (existing timer logic is kept as-is).
  - Remove the `cart-1`/`cart-2` style test IDs from local state — they are no longer used.
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 6.1 Write example tests for Product Detail "Add to cart" button
  - Create `__tests__/cart/productDetail.test.tsx`.
  - Render `ProductDetailPage` with a mock `CartContext` providing a jest spy for `addToCart`.
  - Assert button click calls `addToCart` with the correct payload (name, price, productId, store,
    selectedVariants, quantity). **Validates: Requirements 3.1**
  - Assert button text changes to "Added to cart" after click. **Validates: Requirements 3.2**
  - Assert button is enabled when `selectedVariants` is `{}`. **Validates: Requirements 3.3**

- [x] 7. Rewrite `app/cart/page.tsx` to use `CartContext`
  - Remove the `CartItem` local type and `INITIAL_CART` constant; import `CartItem` from
    `@/types/cart.ts`.
  - Destructure `items`, `updateQuantity`, `removeFromCart` from `useCart()`.
  - Keep `selected: Set<string>` as local `useState` (initialized from `items` IDs on first
    render, or start empty — match current behavior of pre-selecting all).
  - Replace local `updateQuantity` and `removeItem` with the context versions.
  - Replace the "Delete All" handler: call `removeFromCart` for each ID in `selected`, then clear
    `selected`.
  - Import `useRouter` from `next/navigation`; replace the `<Link href="/checkout">` CTA with a
    `<button>` that:
    1. Writes `JSON.stringify([...selected])` to `sessionStorage` under
       `"crafties_checkout_ids"`.
    2. Calls `router.push("/checkout")`.
  - Disable the CTA button when `selected.size === 0` (add `disabled` + styling).
  - Derive `selectedItems` and `subtotal` from `items` filtered by `selected` (same as before).
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 7.1 Write property test for sessionStorage write on checkout CTA
  - Create `__tests__/cart/cartPage.test.tsx`.
  - Generate a random subset of cart item IDs, simulate clicking the CTA, assert
    `JSON.parse(sessionStorage.getItem("crafties_checkout_ids"))` equals the selected ID array.
  - **Property 7: Checkout CTA writes exactly the selected IDs to sessionStorage**
  - **Validates: Requirements 4.7**

- [ ]* 7.2 Write example tests for Cart Page UI
  - Render `CartPage` with a mock context providing a known `items` array.
  - Assert quantity stepper calls `updateQuantity` with the correct ID and value.
    **Validates: Requirements 4.2**
  - Assert trash button calls `removeFromCart` with the correct ID. **Validates: Requirements 4.3**
  - Assert CTA is disabled when nothing is selected. **Validates: Requirements 4.6**

- [x] 8. Implement checkout totals helper (pure function)
  - Create `lib/checkoutUtils.ts` (no `"use client"`) with:
    - `filterCheckoutItems(items: CartItem[], ids: string[]): CartItem[]`
    - `calcCheckoutTotals(items: CartItem[]): { subtotal: number; shippingCost: number; adminFee:
      number; total: number }` — hardcoded `shippingCost = 15000`, `adminFee = 1000`.
  - _Requirements: 5.2, 5.4_

- [ ]* 8.1 Write property tests for checkout utilities
  - Create `__tests__/cart/checkoutUtils.test.ts`.
  - **Property 8: Checkout Page filter preserves exactly the stored IDs** — generate arbitrary
    `CartItem[]` and ID subsets, assert filter output contains exactly the matched items.
    **Validates: Requirements 5.2**
  - **Property 9: Checkout totals are arithmetically correct** — generate arbitrary `CartItem[]`,
    assert `subtotal === sum(price * qty)` and `total === subtotal + 16000`. **Validates:
    Requirements 5.4**

- [x] 9. Rewrite `app/checkout/page.tsx` to use `CartContext` and `checkoutUtils`
  - Remove `CHECKOUT_ITEMS` constant.
  - Add `"use client"` directive (it already exists).
  - Destructure `items` from `useCart()`.
  - On mount (via `useEffect` setting state, or lazy `useState` initializer), read
    `sessionStorage.getItem("crafties_checkout_ids")` inside a
    `typeof window !== "undefined"` guard; parse to `string[]`; fall back to `[]` on missing/error.
  - Use `filterCheckoutItems` and `calcCheckoutTotals` from `lib/checkoutUtils.ts`.
  - If the ID list is empty (no sessionStorage data), display all cart items as fallback.
  - Replace the hardcoded `item.variant` string with
    `formatVariants(item.selectedVariants)` from `types/cart.ts`.
  - Replace hardcoded subtotal/total computation with values from `calcCheckoutTotals`.
  - Update the "Total Price (N barang)" label to use `checkoutItems.reduce((a, i) => a + i.quantity, 0)`.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 9.1 Write example tests for Checkout Page
  - Render `CheckoutPage` with mock context + mock `sessionStorage`.
  - Assert rendered items match the sessionStorage-filtered subset. **Validates: Requirements 5.1,
    5.2**
  - Assert total displayed equals `subtotal + 16000`. **Validates: Requirements 5.4**
  - Assert fallback to all items when `sessionStorage` is empty. **Validates: Requirements 5.3**

- [x] 10. Checkpoint — test all consumer pages compile cleanly
  - Run `tsc --noEmit`. Ensure no TypeScript errors in any modified file. Ask the user if
    questions arise.

- [x] 11. Update `components/Navbar.tsx` cart badge
  - Import `useCart` from `@/contexts/CartContext`.
  - Destructure `totalItems` from `useCart()`.
  - Remove the static `<span className="... w-2 h-2 bg-blue-600 rounded-full ...">` dot.
  - Add a conditional badge:
    ```tsx
    {totalItems > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                       bg-blue-600 text-white text-[10px] font-bold flex items-center
                       justify-center border-2 border-white dark:border-neutral-950 px-0.5">
        {totalItems > 99 ? "99+" : totalItems}
      </span>
    )}
    ```
  - Keep the `"use client"` directive (already present).
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 11.1 Write property test for badge label formatter
  - Create `__tests__/cart/navbarBadge.test.ts`.
  - Extract the badge label logic into a pure `badgeLabel(count: number): string | null`
    helper (returns `null` when 0).
  - Generate integers 0–200 with fast-check, assert:
    - count 0 → `null`
    - count 1–99 → string of the number
    - count ≥ 100 → `"99+"`
  - **Property 10: Badge label is correct for all counts**
  - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 12. Final checkpoint — full build and all tests pass
  - Run `npm run build` (or `tsc --noEmit`) and confirm zero errors.
  - Run the test suite (`npx jest --runInBand` or equivalent).
  - Manually verify in the browser: add an item, confirm badge updates; go to cart, check out,
    confirm filtered items appear on checkout page.
  - Ask the user if any questions arise before marking complete.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- All property tests use **fast-check** with a minimum of 100 iterations per property.
- `useRouter` must be imported from `next/navigation` (not `next/router`) — App Router convention.
- `localStorage` and `sessionStorage` must always be accessed inside
  `typeof window !== "undefined"` guards or `useEffect` callbacks to avoid SSR crashes during
  Next.js prerendering.
- `CartProvider` does **not** need `"use client"` in `app/layout.tsx` itself — the directive lives
  inside `contexts/CartContext.tsx`; the Server Component layout simply imports and renders it.
- The Cart Page CTA must use `router.push("/checkout")` (not `<Link>`) so that `sessionStorage`
  is written atomically before navigation fires.
