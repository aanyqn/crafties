"use client";

import { useState, useMemo, useRef } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  FolderOpen,
  Upload,
  ImageIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryStatus = "Active" | "Inactive";

type AdminCategory = {
  id: string;
  name: string;
  description: string;
  image: string;       // path or blob URL
  status: CategoryStatus;
  productCount: number;
  updatedAt: string;   // ISO string
};

type ModalState =
  | { type: "add" }
  | { type: "edit";   category: AdminCategory }
  | { type: "delete"; category: AdminCategory }
  | null;

type FilterStatus = "All" | CategoryStatus;

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = Date.now();
const mins  = (n: number) => new Date(now - n * 60_000).toISOString();
const hours = (n: number) => new Date(now - n * 3_600_000).toISOString();
const days  = (n: number) => new Date(now - n * 86_400_000).toISOString();

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: "CAT-001", name: "Decorations",       description: "Home decoration items handmade by local crafters",      image: "/assets/img/category-1.png",    status: "Active",   productCount: 124, updatedAt: mins(30)   },
  { id: "CAT-002", name: "Accessories",        description: "Handcrafted accessories including bracelets and bags",  image: "/assets/img/category-2.png",    status: "Active",   productCount: 89,  updatedAt: hours(1)   },
  { id: "CAT-003", name: "Toys & Amigurumi",   description: "Handmade toys and crochet character dolls",             image: "/assets/img/category-3-v2.png", status: "Active",   productCount: 56,  updatedAt: hours(2)   },
  { id: "CAT-004", name: "Gifts & Hampers",    description: "Curated gift sets and handmade hamper packages",        image: "/assets/img/category-4.png",    status: "Active",   productCount: 43,  updatedAt: hours(5)   },
  { id: "CAT-005", name: "Batik & Textiles",   description: "Traditional batik fabric and handwoven textiles",       image: "/assets/img/category-1.png",    status: "Active",   productCount: 67,  updatedAt: days(1)    },
  { id: "CAT-006", name: "Pottery & Ceramics", description: "Hand-thrown pottery and ceramic art pieces",            image: "/assets/img/category-2.png",    status: "Active",   productCount: 31,  updatedAt: days(2)    },
  { id: "CAT-007", name: "Woodcraft",          description: "Carved and crafted wooden furniture and decorations",   image: "/assets/img/category-3-v2.png", status: "Inactive", productCount: 28,  updatedAt: days(3)    },
  { id: "CAT-008", name: "Jewelry & Beads",    description: "Handmade jewelry including necklaces and earrings",     image: "/assets/img/category-4.png",    status: "Active",   productCount: 95,  updatedAt: days(5)    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  const d = Math.floor(hrs / 24);
  if (d < 30)    return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

function generateId(existing: AdminCategory[]): string {
  const nums = existing
    .map((c) => parseInt(c.id.replace("CAT-", ""), 10))
    .filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `CAT-${String(next).padStart(3, "0")}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CategoryStatus }) {
  return status === "Active" ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold
                     bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200
                     dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold
                     bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200
                     dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700">
      Inactive
    </span>
  );
}

// ─── Form modal (Add / Edit) ──────────────────────────────────────────────────

interface FormModalProps {
  initial?: AdminCategory;
  onSave: (data: Pick<AdminCategory, "name" | "description" | "image">) => void;
  onClose: () => void;
}

function CategoryFormModal({ initial, onSave, onClose }: FormModalProps) {
  const isEdit = !!initial;

  const [name,        setName]        = useState(initial?.name        ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl,    setImageUrl]    = useState(initial?.image        ?? "");
  const [preview,     setPreview]     = useState<string | null>(initial?.image ?? null);
  const [errors,      setErrors]      = useState<{ name?: string }>({});

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageUrl(url);
  };

  const handleSubmit = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = "Category name is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ name: name.trim(), description: description.trim(), image: imageUrl });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[480px] rounded-2xl shadow-2xl animate-modal-in
                      bg-white dark:bg-neutral-900
                      border border-neutral-200 dark:border-neutral-700">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b
                        border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors
                       text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                       dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5
                               text-neutral-600 dark:text-neutral-400">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({}); }}
              placeholder="e.g. Woodcraft"
              className={`w-full h-10 px-3 rounded-lg text-sm transition-all
                          bg-neutral-50 dark:bg-neutral-800
                          text-neutral-900 dark:text-neutral-100
                          placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                          border focus:outline-none focus:ring-2
                          ${errors.name
                            ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                            : "border-neutral-200 dark:border-neutral-700 focus:border-[#0022FF] focus:ring-blue-100 dark:focus:ring-blue-900/30"
                          }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5
                               text-neutral-600 dark:text-neutral-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none transition-all
                         bg-neutral-50 dark:bg-neutral-800
                         border border-neutral-200 dark:border-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                         focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5
                               text-neutral-600 dark:text-neutral-400">
              Category Image
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full rounded-xl border-2 border-dashed transition-colors p-5
                          flex flex-col items-center gap-3 cursor-pointer
                          ${preview
                            ? "border-[#0022FF]/30 dark:border-[#4d6bff]/30 bg-blue-50/30 dark:bg-blue-950/10"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-[#0022FF]/50 dark:hover:border-[#4d6bff]/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }`}
            >
              {preview ? (
                /* Preview */
                <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-[#0022FF]/20 dark:ring-[#4d6bff]/20">
                  {/* Use img tag for blob URLs — Next.js Image doesn't support them */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center
                                bg-neutral-100 dark:bg-neutral-800">
                  <Upload size={20} className="text-neutral-400 dark:text-neutral-500" />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {preview ? "Click to change image" : "Click to upload image"}
                </p>
                <p className="text-xs mt-0.5 text-neutral-400 dark:text-neutral-500">
                  PNG, JPG, WEBP — up to 2 MB
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border text-sm font-medium transition-colors
                       border-neutral-200 dark:border-neutral-700
                       text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors
                       bg-[#0022FF] hover:bg-[#0017AA]
                       dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
          >
            {isEdit ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  category,
  onConfirm,
  onCancel,
}: {
  category: AdminCategory;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-[400px] p-6 rounded-2xl shadow-2xl animate-modal-in
                      bg-white dark:bg-neutral-900
                      border border-neutral-200 dark:border-neutral-700">

        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors
                     text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                     dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
                        bg-red-50 dark:bg-red-950">
          <Trash2 size={22} className="text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-base font-bold text-center mb-1
                       text-neutral-900 dark:text-neutral-100">
          Delete Category?
        </h2>
        <p className="text-sm text-center mb-5 leading-relaxed
                      text-neutral-500 dark:text-neutral-400">
          Are you sure you want to delete{" "}
          <strong className="text-neutral-800 dark:text-neutral-200">{category.name}</strong>?{" "}
          This action cannot be undone.
        </p>

        {/* Category chip */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-5 border
                        bg-neutral-50 dark:bg-neutral-800
                        border-neutral-200 dark:border-neutral-700">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0
                          bg-neutral-200 dark:bg-neutral-700">
            {category.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={14} className="absolute inset-0 m-auto text-neutral-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate
                          text-neutral-900 dark:text-neutral-100">
              {category.name}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {category.productCount} products
            </p>
          </div>
          <StatusBadge status={category.status} />
        </div>

        {/* Warning if category has products */}
        {category.productCount > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-xl mb-5 border
                          bg-amber-50 dark:bg-amber-950/30
                          border-amber-200 dark:border-amber-800/50">
            <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs leading-relaxed
                          text-amber-700 dark:text-amber-400">
              This category contains{" "}
              <strong>{category.productCount} products</strong>. Deleting it may
              affect existing product listings.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border text-sm font-medium transition-colors
                       border-neutral-200 dark:border-neutral-700
                       text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors
                       bg-red-600 hover:bg-red-700
                       dark:bg-red-700 dark:hover:bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [modal,        setModal]        = useState<ModalState>(null);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categories.filter((c) => {
      const matchSearch  = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchStatus  = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [categories, search, statusFilter]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total    = categories.length;
  const active   = categories.filter((c) => c.status === "Active").length;
  const inactive = categories.filter((c) => c.status === "Inactive").length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleSave(data: Pick<AdminCategory, "name" | "description" | "image">) {
    if (modal?.type === "edit") {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === modal.category.id
            ? { ...c, ...data, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } else {
      const newCat: AdminCategory = {
        id:           generateId(categories),
        ...data,
        status:       "Active",
        productCount: 0,
        updatedAt:    new Date().toISOString(),
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setModal(null);
  }

  function handleDelete() {
    if (modal?.type !== "delete") return;
    setCategories((prev) => prev.filter((c) => c.id !== modal.category.id));
    setModal(null);
  }

  function toggleStatus(id: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:    c.status === "Active" ? "Inactive" : "Active",
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <AdminHeader
        title="Categories"
        description="Manage and organize product categories for the Crafties catalog"
      />

      <main className="flex-1 p-3 sm:p-6 overflow-auto">

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: "Total Categories", value: total,    color: "text-[#0022FF]",                          bg: "bg-blue-50 dark:bg-blue-950/40"       },
            { label: "Active",           value: active,   color: "text-emerald-600 dark:text-emerald-400",  bg: "bg-emerald-50 dark:bg-emerald-950/40"  },
            { label: "Inactive",         value: inactive, color: "text-neutral-500 dark:text-neutral-400",  bg: "bg-neutral-50 dark:bg-neutral-900"     },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800
                          bg-white dark:bg-neutral-900 ${bg}`}
            >
              <p className="text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="rounded-2xl border overflow-hidden
                        bg-white dark:bg-neutral-900
                        border-neutral-200 dark:border-neutral-800">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b
                          border-neutral-100 dark:border-neutral-800">

            {/* Search */}
            <div className="relative flex-1 min-w-[140px] max-w-[320px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-neutral-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm transition-all
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-900 dark:text-neutral-100
                           placeholder-neutral-400 dark:placeholder-neutral-500
                           focus:outline-none focus:border-[#0022FF]
                           focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           cursor-pointer transition-all
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2
                                                text-neutral-400 pointer-events-none" />
            </div>

            {/* Count */}
            <p className="text-xs whitespace-nowrap hidden sm:block
                          text-neutral-400 dark:text-neutral-500">
              {filtered.length} of {total} categories
            </p>

            {/* Add button */}
            <button
              onClick={() => setModal({ type: "add" })}
              className="ml-auto flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold
                         text-white transition-colors
                         bg-[#0022FF] hover:bg-[#0017AA]
                         dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {["ID", "Category Name", "Image", "Status", "Last Updated", "Action"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap
                                    text-neutral-400 dark:text-neutral-500
                                    ${i === 5 ? "text-right pr-5" : ""}`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center
                                        bg-neutral-100 dark:bg-neutral-800">
                          <FolderOpen size={28} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium
                                      text-neutral-500 dark:text-neutral-400">
                          No categories found
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600">
                          Try adjusting your search or add a new category
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0
                                 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                          {cat.id}
                        </span>
                      </td>

                      {/* Category Name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs mt-0.5 max-w-[220px] truncate
                                        text-neutral-400 dark:text-neutral-500">
                            {cat.description}
                          </p>
                        )}
                      </td>

                      {/* Image */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border
                                          bg-neutral-100 dark:bg-neutral-800
                                          border-neutral-200 dark:border-neutral-700">
                            {cat.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon
                                size={14}
                                className="absolute inset-0 m-auto text-neutral-400"
                              />
                            )}
                          </div>
                          <span className="text-xs max-w-[100px] truncate
                                           text-neutral-400 dark:text-neutral-500">
                            {cat.image ? cat.image.split("/").pop() : "No image"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={cat.status} />
                      </td>

                      {/* Last Updated */}
                      <td className="px-4 py-3.5 whitespace-nowrap
                                     text-neutral-500 dark:text-neutral-400">
                        {timeAgo(cat.updatedAt)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right pr-5">
                        <div className="flex items-center justify-end gap-1.5">

                          {/* Toggle status — outline pill (matches wireframe left button) */}
                          <button
                            onClick={() => toggleStatus(cat.id)}
                            className={`h-7 px-3 rounded-full text-[11px] font-medium border transition-colors
                              ${cat.status === "Active"
                                ? "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-red-200 hover:text-red-500 dark:hover:border-red-800 dark:hover:text-red-400"
                                : "border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              }`}
                          >
                            {cat.status === "Active" ? "Deactivate" : "Activate"}
                          </button>

                          {/* Edit — icon button */}
                          <button
                            onClick={() => setModal({ type: "edit", category: cat })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                                       text-neutral-400
                                       hover:text-[#0022FF] dark:hover:text-[#4d6bff]
                                       hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete — icon button (matches wireframe right filled button) */}
                          <button
                            onClick={() => setModal({ type: "delete", category: cat })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                                       text-neutral-400
                                       hover:text-red-600 dark:hover:text-red-400
                                       hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete"
                          >
                            <Trash2 size={14} />
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

      {/* ── Modals ── */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <CategoryFormModal
          initial={modal.type === "edit" ? modal.category : undefined}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirmModal
          category={modal.category}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
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