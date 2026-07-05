import { AlertTriangle, Power, PowerOff, Trash2, X } from "lucide-react";
import { Product } from "@/types/product";
import { CategoryBadge, formatRupiah, ProductThumb } from "./ProductUI";

export type ConfirmAction = "delete" | "deactivate" | "activate";

interface ConfirmModalProps {
  product: Product;
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ product, action, onConfirm, onCancel }: ConfirmModalProps) {
  const config = {
    delete: {
      title: "Hapus Produk?",
      message: (
        <>
          Produk <strong className="text-neutral-800 dark:text-neutral-200">{product.name}</strong>{" "}
          akan dihapus permanen dari etalase toko dan tidak bisa dikembalikan.
        </>
      ),
      icon: <Trash2 size={22} className="text-red-600 dark:text-red-400" />,
      iconBg: "bg-red-50 dark:bg-red-950",
      note: "Tindakan ini tidak dapat dibatalkan. Data varian dan riwayat produk ini akan ikut terhapus.",
      noteCls: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
      confirmCls: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
      confirmLabel: "Ya, Hapus",
    },
    deactivate: {
      title: "Nonaktifkan Produk?",
      message: (
        <>
          Produk <strong className="text-neutral-800 dark:text-neutral-200">{product.name}</strong>{" "}
          akan disembunyikan dari etalase toko dan tidak bisa dibeli pembeli.
        </>
      ),
      icon: <PowerOff size={22} className="text-red-600 dark:text-red-400" />,
      iconBg: "bg-red-50 dark:bg-red-950",
      note: "Kamu bisa mengaktifkan kembali produk ini kapan saja.",
      noteCls: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
      confirmCls: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
      confirmLabel: "Ya, Nonaktifkan",
    },
    activate: {
      title: "Aktifkan Produk?",
      message: (
        <>
          Produk <strong className="text-neutral-800 dark:text-neutral-200">{product.name}</strong>{" "}
          akan tampil kembali di etalase toko dan bisa dibeli pembeli.
        </>
      ),
      icon: <Power size={22} className="text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950",
      note: "Etalase toko akan diperbarui secara langsung setelah produk diaktifkan.",
      noteCls:
        "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
      confirmCls: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600",
      confirmLabel: "Ya, Aktifkan",
    },
  }[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[400px] p-6 border border-neutral-200 dark:border-neutral-700 animate-modal-in">
        <button
          title="cancel-modal"
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={16} />
        </button>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${config.iconBg}`}>
          {config.icon}
        </div>

        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 text-center mb-1">
          {config.title}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-5 leading-relaxed">
          {config.message}
        </p>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-5 border border-neutral-200 dark:border-neutral-700">
          <ProductThumb product={product} size={32} rounded="rounded-lg" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{product.name}</p>
            <p className="text-xs text-neutral-400 truncate">{formatRupiah(product.price)}</p>
          </div>
          <div className="ml-auto">
            <CategoryBadge category={product.category} />
          </div>
        </div>

        <div className={`flex items-start gap-2 p-3 rounded-xl border mb-5 ${config.noteCls}`}>
          <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{config.note}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors ${config.confirmCls}`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}