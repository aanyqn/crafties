export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  /** e.g. { "Warna": "Hitam", "Ukuran": "M" } */
  selectedVariants: Record<string, string>;
  quantity: number;
  store: string;
}

/**
 * Formats selectedVariants into a human-readable display string.
 * e.g. { "Warna": "Hitam", "Ukuran": "M" } → "Warna: Hitam, Ukuran: M"
 * Empty object returns "".
 */
export function formatVariants(selectedVariants: Record<string, string>): string {
  return Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

/**
 * Produces a stable, order-independent key for a selectedVariants map.
 * Used for duplicate detection in addToCart.
 */
export function variantKey(selectedVariants: Record<string, string>): string {
  return JSON.stringify(
    Object.keys(selectedVariants)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = selectedVariants[k];
        return acc;
      }, {})
  );
}
