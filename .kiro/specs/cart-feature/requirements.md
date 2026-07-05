# Requirements Document

## Introduction

This feature implements a fully functional shopping cart for Crafties, a handmade goods marketplace
built with Next.js 16, TypeScript, and Tailwind CSS. Currently the cart, product detail, checkout pages, and Navbar
all use disconnected hardcoded data. The goal is to replace all of that with a single shared cart
state backed by React Context API and persisted to localStorage, so items added on the product detail
page appear in the cart, the Navbar badge reflects the real count, and the checkout page receives
the items the user actually selected.

---

## Glossary

- **Cart**: The collection of CartItem objects belonging to the current browser session.
- **CartContext**: The React context that holds cart state and exposes cart actions to any client component.
- **CartProvider**: The client component that wraps the application and provides CartContext.
- **CartItem**: A single line-item in the cart — one product + one variant combination + a quantity.
- **SelectedVariants**: A mapping from variant group label (e.g. `"Warna"`) to the chosen option name (e.g. `"Hitam"`).
- **Cart Page**: `app/cart/page.tsx` — displays all CartItems with checkboxes, quantity controls, and a checkout CTA.
- **Checkout Page**: `app/checkout/page.tsx` — displays only the user-selected subset of CartItems and collects shipping/payment choices.
- **Product Detail Page**: `app/products/[id]/page.tsx` — product page with variant selector, quantity picker, and "Add to cart" button.
- **Navbar**: `components/Navbar.tsx` — site-wide navigation bar with a cart icon badge.
- **localStorage**: Browser storage used to persist the cart across page refreshes and tab reopens.
- **sessionStorage**: Browser storage used to pass the set of selected cart-item IDs from the Cart Page to the Checkout Page within the same browsing session.

---

## Requirements

### Requirement 1: Define CartItem type and update type files

**User Story:** As a developer, I want a canonical `CartItem` type in `types/cart.ts`,
so that all parts of the application share a consistent data shape for cart items.

#### Acceptance Criteria

1. THE `CartItem` type SHALL be defined in `types/cart.ts` with the following fields:
   `id` (string), `productId` (string), `name` (string), `price` (number), `image` (string),
   `selectedVariants` (Record\<string, string\>), `quantity` (number), `store` (string).
2. THE `CartItem` type SHALL replace the locally-defined `CartItem` type in `app/cart/page.tsx`
   so that the page imports the canonical type from `types/cart.ts`.
3. WHEN the `selectedVariants` field is serialized to display text (e.g. "Warna: Hitam, Ukuran: M"),
   THE system SHALL derive the display string from `selectedVariants` entries joined by `", "`.

---

### Requirement 2: Create CartContext with localStorage persistence

**User Story:** As a user, I want my cart to persist across page refreshes and when I
navigate between pages, so that I never lose items I have added to the cart.

#### Acceptance Criteria

1. THE `CartProvider` component in `contexts/CartContext.tsx` SHALL initialize cart state by
   reading from `localStorage` under the key `"crafties_cart"` when first mounted on the client.
2. WHEN cart state changes, THE `CartProvider` SHALL write the updated cart array to
   `localStorage` under the key `"crafties_cart"` as a JSON string.
3. THE `CartContext` SHALL expose the following actions to consumers:
   `addToCart(item: Omit<CartItem, "id">): void`,
   `removeFromCart(cartItemId: string): void`,
   `updateQuantity(cartItemId: string, quantity: number): void`,
   `clearCart(): void`.
4. WHEN `addToCart` is called with a product-variant combination that already exists in the cart,
   THE `CartContext` SHALL increment the existing item's quantity by the provided amount rather
   than adding a duplicate line.
5. IF `updateQuantity` is called with a quantity less than 1, THEN THE `CartContext` SHALL
   remove that item from the cart.
6. THE `CartContext` SHALL expose a derived value `totalItems: number` equal to the sum of
   `quantity` across all CartItems in the cart.
7. IF `localStorage` is unavailable (e.g. SSR or private browsing with storage blocked),
   THEN THE `CartProvider` SHALL initialize with an empty cart array and suppress the error.
8. THE `CartProvider` SHALL be added to `app/layout.tsx` so that it wraps the entire application
   tree below `ThemeProvider`.

---

### Requirement 3: Wire Product Detail Page "Add to Cart" button

**User Story:** As a shopper, I want to click "Add to cart" on a product page and have
the item actually saved to my cart, so that I can continue shopping and purchase later.

#### Acceptance Criteria

1. WHEN a user clicks "Add to cart" on `app/products/[id]/page.tsx`, THE Product Detail Page
   SHALL call `addToCart` from `CartContext` with the product's id, name, price, image, store
   (badge), selected variants, and the current quantity.
2. WHEN `addToCart` is called, THE Product Detail Page SHALL show a brief "Added to cart ✓"
   confirmation state on the button for 2500 ms, then revert to "Add to cart".
3. WHILE no variant group has a selection, THE Product Detail Page SHALL not disable the button —
   adding without a variant selection is allowed (selectedVariants will be an empty object `{}`).

---

### Requirement 4: Replace hardcoded data in Cart Page

**User Story:** As a shopper, I want the cart page to display the items I have actually added,
so that I can review and manage my cart before proceeding to checkout.

#### Acceptance Criteria

1. THE Cart Page SHALL read cart items from `CartContext` via `useCart()` instead of the
   hardcoded `INITIAL_CART` constant.
2. WHEN a user changes an item's quantity via the stepper controls, THE Cart Page SHALL call
   `updateQuantity` from `CartContext`.
3. WHEN a user removes an item via the trash button, THE Cart Page SHALL call `removeFromCart`
   from `CartContext`.
4. WHEN a user clicks "Delete All", THE Cart Page SHALL call `removeFromCart` for every currently
   selected item.
5. THE Cart Page SHALL maintain a local `selected` state (Set of cart item IDs) for checkbox
   selection; this selection is local UI state only and SHALL NOT be stored in `CartContext`.
6. THE Cart Page's checkout CTA ("Beli") SHALL be disabled when no items are selected.
7. WHEN a user clicks the checkout CTA with at least one item selected, THE Cart Page SHALL
   write the selected item IDs array to `sessionStorage` under the key `"crafties_checkout_ids"`,
   then navigate to `/checkout`.

---

### Requirement 5: Replace hardcoded data in Checkout Page

**User Story:** As a shopper, I want the checkout page to show only the items I checked in the
cart, so that I can complete my order for exactly the products I chose.

#### Acceptance Criteria

1. WHEN the Checkout Page mounts, THE Checkout Page SHALL read the selected item IDs from
   `sessionStorage` under the key `"crafties_checkout_ids"`.
2. THE Checkout Page SHALL filter items from `CartContext` to include only the items whose IDs
   are in the `sessionStorage` list.
3. IF `sessionStorage` is empty or `"crafties_checkout_ids"` is not set, THEN THE Checkout Page
   SHALL display all items currently in the cart as a fallback.
4. THE Checkout Page SHALL derive subtotal, shipping cost (fixed Rp 15.000), admin fee (fixed
   Rp 1.000), and total from the filtered items — not from hardcoded `CHECKOUT_ITEMS`.
5. WHEN the Checkout Page displays a cart item's variant information, THE Checkout Page SHALL
   render the display string derived from `selectedVariants` (Requirement 1.3).

---

### Requirement 6: Update Navbar cart icon badge

**User Story:** As a shopper, I want the cart icon in the Navbar to show how many items are in
my cart, so that I have a persistent visual indicator of my cart contents.

#### Acceptance Criteria

1. THE Navbar SHALL display `totalItems` from `CartContext` as a numeric badge on the cart icon
   when `totalItems` is greater than 0.
2. WHEN `totalItems` is 0, THE Navbar SHALL hide the badge entirely instead of showing "0".
3. THE badge SHALL display the number as a string; WHEN `totalItems` exceeds 99, THE Navbar
   SHALL display "99+" instead of the exact number.
4. THE Navbar SHALL use `useCart()` only within a client-side component; the existing
   `'use client'` directive on `Navbar.tsx` satisfies this requirement.
