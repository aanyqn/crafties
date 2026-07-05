import { CartItem } from "@/types/cart";

/**
 * Returns only the items whose `id` is present in the `ids` array.
 * If `ids` is empty, returns all `items` as a fallback.
 */
export function filterCheckoutItems(items: CartItem[], ids: string[]): CartItem[] {
  if (ids.length === 0) {
    return items;
  }
  const idSet = new Set(ids);
  return items.filter((item) => idSet.has(item.id));
}

/**
 * Derives checkout totals from a list of cart items.
 * - subtotal    = sum of price * quantity for each item
 * - shippingCost = 15000 (fixed)
 * - adminFee    = 1000  (fixed)
 * - total       = subtotal + shippingCost + adminFee
 */
export function calcCheckoutTotals(items: CartItem[]): {
  subtotal: number;
  shippingCost: number;
  adminFee: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 15000;
  const adminFee = 1000;
  const total = subtotal + shippingCost + adminFee;

  return { subtotal, shippingCost, adminFee, total };
}
