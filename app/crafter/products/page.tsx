"use client";

import { useMemo, useState } from "react";
import { Eye, Plus, Power, PowerOff, Search, ChevronDown } from "lucide-react";
import SellerHeader from "@/components/crafter/SellerHeader";
import ConfirmModal, { ConfirmAction } from "@/components/crafter/ConfirmModal";
import DetailModal from "@/components/crafter/DetailModal";
import ProductFormModal from "@/components/crafter/ProductFormModal";
import {
    CategoryBadge,
    formatDate,
    formatRupiah,
    ProductThumb,
    StatusBadge,
    StockBadge,
    totalStock,
} from "@/components/crafter/ProductUI";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { PRODUCT_CATEGORIES, Product, ProductCategory, ProductStatus } from "@/types/product";
import { PackageOpen } from "lucide-react";
import { ProductDetail, getProductDetail } from "@/types/productDetail";

type FilterCategory = "All" | ProductCategory;
type FilterStatus = "All" | ProductStatus;

interface ConfirmState {
    product: Product;
    action: ConfirmAction;
}

interface FormState {
    mode: "add" | "edit";
    product?: ProductDetail;
}

export default function SellerProductsPage() {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

    const [detailProduct, setDetailProduct] = useState<ProductDetail | null>(null);
    const [formState, setFormState] = useState<FormState | null>(null);
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

    /* ── Filtered list ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return products.filter((p) => {
            const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
            const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
            const matchStatus = statusFilter === "All" || p.status === statusFilter;
            return matchSearch && matchCategory && matchStatus;
        });
    }, [products, search, categoryFilter, statusFilter]);

    /* ── Stats ── */
    const total = products.length;
    const active = products.filter((p) => p.status === "Active").length;
    const inactive = products.filter((p) => p.status === "Inactive").length;

    /* ── Actions ── */
    function openToggleConfirm(product: Product) {
        setDetailProduct(null);
        setConfirmState({ product, action: product.status === "Active" ? "deactivate" : "activate" });
    }

    function openDeleteConfirm(product: Product) {
        setDetailProduct(null);
        setConfirmState({ product, action: "delete" });
    }

    function handleConfirm() {
        if (!confirmState) return;
        const { product, action } = confirmState;
        if (action === "delete") {
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
        } else {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === product.id ? { ...p, status: action === "activate" ? "Active" : "Inactive" } : p
                )
            );
        }
        setConfirmState(null);
    }

    function handleSaveProduct(data: Product) {
        setProducts((prev) => {
            const exists = prev.some((p) => p.id === data.id);
            return exists ? prev.map((p) => (p.id === data.id ? data : p)) : [data, ...prev];
        });
        setFormState(null);
        setDetailProduct(null);
    }

    return (
        <>
            <SellerHeader
                title="Product"
                description="Manage your products."
                actions={
                    <button
                        onClick={() => setFormState({ mode: "add" })}
                        className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white bg-[#0022FF] hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add New Product</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                }
            />

            <main className="flex-1 p-3 sm:p-6 overflow-auto">
                {/* ── Stats cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {[
                        { label: "Total Products", value: total, color: "text-[#0022FF]", bg: "bg-blue-50 dark:bg-blue-950/40" },
                        {
                            label: "Active Products",
                            value: active,
                            color: "text-emerald-600 dark:text-emerald-400",
                            bg: "bg-emerald-50 dark:bg-emerald-950/40",
                        },
                        {
                            label: "Inactive Products",
                            value: inactive,
                            color: "text-neutral-500 dark:text-neutral-400",
                            bg: "bg-neutral-100 dark:bg-neutral-800/40",
                        },
                    ].map(({ label, value, color, bg }) => (
                        <div
                            key={label}
                            className={`rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 ${bg}`}
                        >
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Table card ── */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[140px] max-w-[360px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search product..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-900 dark:text-neutral-100
                           placeholder-neutral-400 dark:placeholder-neutral-500
                           focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30
                           transition-all"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="relative">
                            <select
                            title="category"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
                                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF]
                           cursor-pointer transition-all"
                            >
                                <option value="All">All Categories</option>
                                {PRODUCT_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>

                        {/* Status filter */}
                        <div className="relative">
                            <select
                                title="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF]
                           cursor-pointer transition-all"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>

                        <p className="ml-auto text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap hidden sm:block">
                            {filtered.length} of {total} Products
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Product
                                    </th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Price
                                    </th>
                                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Stock
                                    </th>
                                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Added
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right pr-5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                    <PackageOpen size={28} className="text-neutral-300 dark:text-neutral-600" />
                                                </div>
                                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No products found</p>
                                                <p className="text-xs text-neutral-400 dark:text-neutral-600">
                                                    Try adjusting your filters or add a new product
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0
                                 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                                        >
                                            {/* Category */}
                                            <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                                                <p className="font-medium text-[11px] text-neutral-400">{product.id}</p>
                                            </td>
                                            {/* Product */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5 min-w-[180px]">
                                                    <ProductThumb product={product} size={36} />
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                                            {product.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                                                <CategoryBadge category={product.category} />
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3.5 text-neutral-900 dark:text-neutral-100 font-medium whitespace-nowrap">
                                                {formatRupiah(product.price)}
                                            </td>

                                            {/* Stock */}
                                            <td className="hidden md:table-cell px-4 py-3.5 whitespace-nowrap">
                                                <StockBadge stock={totalStock(product)} />
                                            </td>

                                            {/* Date added */}
                                            <td className="hidden lg:table-cell px-4 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                                {product.dateAdded}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <StatusBadge status={product.status} />
                                            </td>

                                            {/* Actions: Detail + Activate/Deactivate */}
                                            <td className="px-4 py-3.5 whitespace-nowrap text-right pr-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setDetailProduct(getProductDetail(product.id) || null)}
                                                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold
                                       text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800
                                       hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                                    >
                                                        <Eye size={13} />
                                                        <span className="hidden md:inline">Detail</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openToggleConfirm(product)}
                                                        className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${product.status === "Active"
                                                            ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                                                            : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                                                            }`}
                                                    >
                                                        {product.status === "Active" ? <PowerOff size={13} /> : <Power size={13} />}
                                                        <span className="hidden md:inline">
                                                            {product.status === "Active" ? "Deactivate" : "Activate"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* ── Detail modal ── */}
            {detailProduct && (
                <DetailModal
                    product={detailProduct}
                    onClose={() => setDetailProduct(null)}
                    onEdit={() => setFormState({ mode: "edit", product: detailProduct })}
                    onDelete={() => openDeleteConfirm(detailProduct.product)}
                    onToggleStatus={() => openToggleConfirm(detailProduct.product)}
                />
            )}

            {/* ── Add / Edit form modal ── */}
            {formState && (
                <ProductFormModal
                    mode={formState.mode}
                    initial={formState.product}
                    onClose={() => setFormState(null)}
                    onSave={handleSaveProduct}
                />
            )}

            {/* ── Confirm modal (activate / deactivate / delete) ── */}
            {confirmState && (
                <ConfirmModal
                    product={confirmState.product}
                    action={confirmState.action}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmState(null)}
                />
            )}

            <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.18s ease-out both; }
      `}</style>
        </>
    );
}