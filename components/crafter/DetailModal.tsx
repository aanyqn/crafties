import { ImagePlus, Pencil, Power, PowerOff, Trash2, X } from "lucide-react";
import { ProductDetail } from "@/types/productDetail";
import { CategoryBadge, formatRupiah, StatusBadge, StockBadge } from "@/components/crafter/ProductUI";

interface DetailModalProps {
  product: ProductDetail;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export default function DetailModal({ product, onClose, onEdit, onDelete, onToggleStatus }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[480px] border border-neutral-200 dark:border-neutral-700 animate-modal-in overflow-hidden max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <button
            title="close-modal"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={16} />
          </button>
          <p className="text-xs font-mono text-neutral-400 mb-1">{product.id}</p>
          <div className="flex items-start justify-between gap-3 pr-8">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              {product.product.name}
            </h2>
            <p className="text-sm font-bold text-[#0022FF] dark:text-blue-400 whitespace-nowrap">
              {formatRupiah(product.product.price)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <CategoryBadge category={product.product.category} />
            <StatusBadge status={product.product.status} />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-4 overflow-y-auto">
          {/* Images */}
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Foto Produk</p>
          {product.images.length > 0 ? (
            <div className="grid grid-cols-5 gap-2 mb-5">
              {product.images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${product.product.name} ${i + 1}`}
                  className="aspect-square rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-dashed border-neutral-200 dark:border-neutral-700">
              <ImagePlus size={14} /> Belum ada foto untuk produk ini
            </div>
          )}

          {/* Dimensions */}
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Dimensi & Berat</p>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              ["Panjang", `${product.product.dimensions.length} cm`],
              ["Lebar", `${product.product.dimensions.width} cm`],
              ["Tinggi", `${product.product.dimensions.height} cm`],
              ["Berat", `${product.product.dimensions.weight} g`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2 text-center"
              >
                <p className="text-[10px] text-neutral-400 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{value}</p>
              </div>
            ))}
          </div>

          {/* Variants, grouped by label (e.g. Color, Size) */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Varian</p>
            <p className="text-xs text-neutral-400">
              Total stok: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{product.total_stock}</span>
            </p>
          </div>
          {product.variants.length > 0 ? (
            <div className="space-y-3 mb-5">
              {product.variants.map((group) => (
                <div key={group.label} className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                  <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                    {group.label}
                  </div>
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {group.options.map((v) => (
                      <div key={v.id} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span className="text-neutral-700 dark:text-neutral-300">{v.name}</span>
                        <StockBadge stock={v.stock} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 mb-5">Belum ada varian untuk produk ini.</p>
          )}

          {/* Description */}
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Deskripsi</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-1">
            {product.description || "Belum ada deskripsi."}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold bg-[#0022FF] hover:bg-blue-700 text-white transition-colors"
            >
              <Pencil size={15} />
              Edit Produk
            </button>
            <button
              onClick={onToggleStatus}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {product.product.status === "Active" ? <PowerOff size={15} /> : <Power size={15} />}
              {product.product.status === "Active" ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </div>
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <Trash2 size={15} />
            Hapus Produk
          </button>
        </div>
      </div>
    </div>
  );
}