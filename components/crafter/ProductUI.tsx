import { Product, ProductStatus } from "@/types/product";

/* ─── Formatting helpers ─── */
export function formatRupiah(value: number): string {
  const n = Number(value) || 0;
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

import { getTotalStock } from "@/types/productDetail";

export function totalStock(product: Product): number {
  return getTotalStock(product.id);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#0022FF", "#7C3AED", "#DB2777", "#D97706", "#059669", "#DC2626",
  "#2563EB", "#9333EA", "#16A34A", "#EA580C", "#0891B2", "#BE185D",
];
export function tileColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/* ─── Status badge ─── */
export function StatusBadge({ status }: { status: ProductStatus }) {
  const map: Record<ProductStatus, { label: string; cls: string }> = {
    Active: {
      label: "Aktif",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800",
    },
    Inactive: {
      label: "Nonaktif",
      cls: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700",
    },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Category badge ─── */
export function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800">
      {category}
    </span>
  );
}

/* ─── Stock badge ─── */
export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800">
        Habis
      </span>
    );
  }
  if (stock <= 5) {
    return <span className="text-amber-600 dark:text-amber-400 font-semibold">{stock}</span>;
  }
  return <span className="text-neutral-700 dark:text-neutral-300">{stock}</span>;
}

/* ─── Image thumbnail (photo or initials tile) ─── */
export function ProductThumb({
  product,
  size = 40,
  rounded = "rounded-lg",
}: {
  product: Product;
  size?: number;
  rounded?: string;
}) {
  const img = product.image;
  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={img}
        alt={product.name}
        style={{ width: size, height: size }}
        className={`${rounded} object-cover flex-shrink-0 border border-neutral-200 dark:border-neutral-700`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, backgroundColor: tileColor(product.id) }}
      className={`${rounded} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}
    >
      {initials(product.name)}
    </div>
  );
}