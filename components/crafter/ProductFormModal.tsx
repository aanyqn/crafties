import { useRef, useState } from "react";
import { ChevronDown, ImagePlus, Plus, Ruler, Trash2, Weight, X } from "lucide-react";
import { PRODUCT_CATEGORIES, Product, ProductCategory } from "@/types/product";
import { ProductDetail } from "@/types/productDetail";

let _idSeq = 1000;
const nextId = (prefix: string) => `${prefix}-${String(_idSeq++).padStart(4, "0")}`;

interface ProductFormModalProps {
    mode: "add" | "edit";
    initial?: ProductDetail;
    onClose: () => void;
    onSave: (product: Product) => void;
}

interface DraftOption {
    id: string;
    name: string;
    stock: string;
}

interface DraftVariant {
    id: string;
    label: string;
    options: DraftOption[];
}


export default function ProductFormModal({ mode, initial, onClose, onSave }: ProductFormModalProps) {
    const isEdit = mode === "edit";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(initial?.product.name ?? "");
    const [category, setCategory] = useState<ProductCategory>(initial?.product.category ?? PRODUCT_CATEGORIES[0]);
    const [price, setPrice] = useState(initial?.product.price != null ? String(initial.product.price) : "");
    const [dimensions, setDimensions] = useState({
        length: initial ? String(initial.product.dimensions.length) : "",
        width: initial ? String(initial.product.dimensions.width) : "",
        height: initial ? String(initial.product.dimensions.height) : "",
        weight: initial ? String(initial.product.dimensions.weight) : "",
    });
    const [description, setDescription] = useState(initial?.description ?? "");
    const [images, setImages] = useState<string[]>(initial?.images ?? []);
    const [variants, setVariants] = useState<DraftVariant[]>(
        initial?.variants?.length
            ? initial.variants.map((v) => ({
                id: v.id,
                label: v.label || "",
                options: v.options?.map((opt) => ({
                    id: String(opt.id), // Paksa ID opsi menjadi string agar konsisten
                    name: opt.name,
                    stock: String(opt.stock),
                })) || []
            }))
            : ([{
                id: nextId("VAR"),
                label: "",
                options: [{ id: nextId("OPT"), name: "", stock: "" }]
            }] as DraftVariant[]) // Tambahkan 'as DraftVariant[]' di sini untuk memaksa kecocokan tipe data
    );

    const [errors, setErrors] = useState<{ name?: string; price?: string; variants?: string }>({});

    function updateVariantLabel(id: string, value: string) {
        setVariants((prev) =>
            prev.map((v) => (v.id === id ? { ...v, label: value } : v))
        );
    }

    function updateOptionField(variantId: string, optionId: string, field: "name" | "stock", value: string) {
        setVariants((prev) =>
            prev.map((v) => {
                if (v.id !== variantId) return v;
                return {
                    ...v,
                    options: v.options.map((opt) =>
                        opt.id === optionId ? { ...opt, [field]: value } : opt
                    ),
                };
            })
        );
    }

    function addVariant() {
        setVariants((prev) => [
            ...prev,
            {
                id: nextId("VAR"),
                label: "",
                options: [{ id: nextId("OPT"), name: "", stock: "" }]
            } as DraftVariant
        ]);
    }

    function addOptionToVariant(variantId: string) {
        setVariants((prev) =>
            prev.map((v) =>
                v.id === variantId
                    ? { ...v, options: [...v.options, { id: nextId("OPT"), name: "", stock: "" }] }
                    : v
            )
        );
    }

    function removeVariant(id: string) {
        setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== id) : prev));
    }
    function removeOptionFromVariant(variantId: string, optionId: string) {
        setVariants((prev) =>
            prev.map((v) => {
                if (v.id !== variantId) return v;
                // Pastikan minimal tersisa 1 opsi agar form tidak kosong melompong
                const newOptions = v.options.length > 1
                    ? v.options.filter((opt) => opt.id !== optionId)
                    : v.options;
                return { ...v, options: newOptions };
            })
        );
    }

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []).slice(0, 6 - images.length);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setImages((prev) => [...prev, reader.result as string].slice(0, 6));
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    }
    function removeImage(idx: number) {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    }

    function validate() {
        const errs: typeof errors = {};
        if (!name.trim()) errs.name = "Nama produk wajib diisi";
        if (!price || Number(price) <= 0) errs.price = "Harga harus lebih dari 0";
        const cleanVariants = variants.filter((v) => v.label.trim());
        if (cleanVariants.length === 0) errs.variants = "Tambahkan minimal 1 varian";
        return errs;
    }

    function handleSubmit() {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        // 1. Membersihkan data variants dan options dari spasi kosong
        // Serta mengubah tipe data stock dari String ke Number
        const cleanVariants = variants
            .filter((v) => v.label.trim() !== "") // Lewati jika label kosong
            .map((v) => ({
                id: v.id,
                label: v.label.trim(),
                // Filter opsi yang namanya tidak kosong
                options: v.options
                    .filter((o) => o.name.trim() !== "")
                    .map((opt) => ({
                        // Jika ProductDetail di API Anda tidak butuh ID untuk opsi, 
                        // Anda bisa menghapus properti 'id' di bawah ini:
                        id: opt.id,
                        name: opt.name.trim(),
                        stock: Number(opt.stock) || 0, // Konversi string form ke number
                    })),
            }))
            // Validasi tambahan: Hanya simpan variant yang setidaknya punya 1 opsi valid
            .filter((v) => v.options.length > 0);

        const product: Product = {
            id: initial?.id ?? nextId("PRD"),
            name: name.trim(),
            sellerId: initial?.product.sellerId ?? "",
            badge: initial?.product.badge ?? "",
            rating: initial?.product.rating ?? 0,
            reviewCount: initial?.product.reviewCount ?? 0,
            sold: initial?.product.sold ?? 0,
            category: category,
            isFeatured: initial?.product.isFeatured ?? false,
            isNew: initial?.product.isNew ?? false,
            discount: initial?.product.discount ?? 0,
            price: Number(price) || 0, 
            image: images[0] || "",
            dimensions: {
                length: Number(dimensions.length) || 0,
                width: Number(dimensions.width) || 0,
                height: Number(dimensions.height) || 0,
                weight: Number(dimensions.weight) || 0,
            },
            status: initial?.product.status ?? "Active",
            dateAdded: initial?.product.dateAdded ?? "00-00-0000",
        };

        onSave(product);
    }

    const inputCls =
        "w-full h-10 px-3 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";
    const labelCls = "block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[560px] border border-neutral-200 dark:border-neutral-700 animate-modal-in overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
                    <button
                        title="closeModal"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        {isEdit ? `Mengubah detail ${initial?.product.name}` : "Lengkapi informasi produk untuk ditampilkan di etalase"}
                    </p>
                </div>

                {/* Scrollable form body */}
                <div className="px-6 py-5 overflow-y-auto space-y-5">
                    {/* Name */}
                    <div>
                        <label className={labelCls}>Nama Produk</label>
                        <input
                            className={inputCls}
                            placeholder="cth. Tas Rotan Bali"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    {/* Category + Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Kategori</label>
                            <div className="relative">
                                <select
                                    title="categories"
                                    className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                                >
                                    {PRODUCT_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Harga</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">Rp</span>
                                <input
                                    className={`${inputCls} pl-8`}
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <label className={labelCls}>Dimensi & Berat</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(
                                [
                                    ["length", "P (cm)"],
                                    ["width", "L (cm)"],
                                    ["height", "T (cm)"],
                                    ["weight", "Berat (g)"],
                                ] as const
                            ).map(([key, ph]) => (
                                <input
                                    key={key}
                                    className={`${inputCls} text-center px-1`}
                                    type="number"
                                    min="0"
                                    placeholder={ph}
                                    value={dimensions[key]}
                                    onChange={(e) => setDimensions((d) => ({ ...d, [key]: e.target.value }))}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                            <Ruler size={11} /> Panjang × Lebar × Tinggi <Weight size={11} className="ml-1" /> Berat
                        </p>
                    </div>

                    {/* Photos */}
                    <div>
                        <label className={labelCls}>Foto Produk</label>
                        <div className="flex flex-wrap gap-2">
                            {images.map((src, i) => (
                                <div key={i} className="relative w-16 h-16 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={src}
                                        alt=""
                                        className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                                    />
                                    <button
                                        title="remove-image"
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <X size={11} />
                                    </button>
                                </div>
                            ))}
                            {images.length < 6 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-16 h-16 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-0.5 text-neutral-400 hover:text-[#0022FF] hover:border-[#0022FF] transition-colors flex-shrink-0"
                                >
                                    <ImagePlus size={16} />
                                    <span className="text-[9px]">Tambah</span>
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
                        <p className="text-[11px] text-neutral-400 mt-1.5">Maksimal 6 foto, format JPG/PNG.</p>
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={`${labelCls} mb-0`}>Varian</label>
                            <button
                                onClick={addVariant}
                                className="flex items-center gap-1 text-xs font-semibold text-[#0022FF] dark:text-blue-400 hover:underline"
                            >
                                <Plus size={13} /> Tambah Grup Varian
                            </button>
                        </div>
                        <div className="space-y-4">
                            {variants.map((v) => (
                                <div key={v.id} className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            className={`${inputCls} flex-1 font-semibold`}
                                            placeholder="Nama Varian (cth. Warna, Ukuran)"
                                            value={v.label}
                                            onChange={(e) => updateVariantLabel(v.id, e.target.value)}
                                        />
                                        <button
                                            title="remove-variant"
                                            onClick={() => removeVariant(v.id)}
                                            disabled={variants.length === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="pl-2 space-y-2 border-l-2 border-neutral-100 dark:border-neutral-800">
                                        {v.options.map((opt) => (
                                            <div key={opt.id} className="flex items-center gap-2 pl-2">
                                                <input
                                                    className={`${inputCls} flex`}
                                                    placeholder="Opsi (cth. Merah)"
                                                    value={opt.name}
                                                    onChange={(e) => updateOptionField(v.id, opt.id, "name", e.target.value)}
                                                />
                                                <input
                                                    className={`${inputCls} w-10 text-center px-1`}
                                                    type="number"
                                                    min="0"
                                                    placeholder="Stok"
                                                    value={opt.stock}
                                                    onChange={(e) => updateOptionField(v.id, opt.id, "stock", e.target.value)}
                                                />
                                                <button
                                                    title="remove-option-variant"
                                                    onClick={() => removeOptionFromVariant(v.id, opt.id)}
                                                    disabled={v.options.length === 1}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex-shrink-0"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="pl-2">
                                            <button
                                                onClick={() => addOptionToVariant(v.id)}
                                                className="text-[11px] font-semibold text-[#0022FF] dark:text-blue-400 hover:underline"
                                            >
                                                + Tambah Opsi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.variants && <p className="text-xs text-red-600 mt-1">{errors.variants}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Deskripsi</label>
                        <textarea
                            className={`${inputCls} h-24 py-2 resize-none`}
                            placeholder="Ceritakan bahan, cara pembuatan, atau keunikan produk ini..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold text-white bg-[#0022FF] hover:bg-blue-700 transition-colors"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}