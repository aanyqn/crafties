"use client";

import { useState, useMemo, useRef } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { ARTICLES } from "@/data/mockArticles";

import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  ImagePlus,
  ImageIcon,
  Star,
  StarOff,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import SellerHeader from "@/components/crafter/SellerHeader";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // Array of paragraphs
  image: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  likes: number;
  dislikes: number;
  isFeatured?: boolean;
};

const articleByCrafter = ARTICLES.find((article) => article.author.name === "Sari Dewi");
const articleList = articleByCrafter ? [articleByCrafter] : [];

type ModalState =
  | { type: "add" }
  | { type: "edit"; article: Article }
  | { type: "delete"; article: Article }
  | null;

// ─── Form Modal (Add / Edit) ──────────────────────────────────────────────────

interface FormModalProps {
  initial?: Article;
  onSave: (data: Partial<Article>) => void;
  onClose: () => void;
}

function ArticleFormModal({ initial, onSave, onClose }: FormModalProps) {
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");

  // Combine content array into a single string with double line breaks
  const [contentStr, setContentStr] = useState(initial?.content.join("\n\n") ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Kerajinan");
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "Article title is required.";
    if (!contentStr.trim()) newErrors.content = "Article content cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Split the textarea string back into an array of strings (paragraphs)
    const contentArray = contentStr
      .split("\n")
      .map(str => str.trim())
      .filter(str => str !== "");

    // Estimated read time: 200 words per minute
    const wordCount = contentArray.join(" ").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    onSave({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: contentArray,
      category,
      readTime,
      image: preview ?? "/assets/img/category-1.png",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      {/* Container widened (max-w-[720px]) for writing comfort */}
      <div className="relative z-10 w-full max-w-[720px] rounded-2xl shadow-2xl animate-modal-in bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {isEdit ? "Edit Article" : "Add New Article"}
          </h2>
          <button title="close-modal" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Left Column: Meta Data */}
            <div className="space-y-4 md:col-span-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-600 dark:text-neutral-400">
                  Category
                </label>
                <div className="relative">
                  <select
                    title="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none w-full h-10 pl-3 pr-8 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#0022FF]"
                  >
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Dekorasi">Dekorasi</option>
                    <option value="Aksesori">Aksesori</option>
                    <option value="Kado">Kado</option>
                    <option value="Bisnis">Bisnis</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-600 dark:text-neutral-400">
                  Cover / Banner
                </label>
                <input title="image" ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-4 flex flex-col items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors h-32"
                >
                  {preview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden border">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <ImagePlus size={18} />
                      </div>
                      <span className="text-xs font-medium text-neutral-500 text-center leading-tight">Upload <br /> Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Writing & Content */}
            <div className="space-y-4 md:col-span-2">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-600 dark:text-neutral-400">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: undefined })); }}
                  placeholder="Type an engaging article title..."
                  className={`w-full h-10 px-3 rounded-lg text-sm border focus:outline-none focus:ring-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${errors.title ? "border-red-400 focus:ring-red-100" : "border-neutral-200 dark:border-neutral-700 focus:border-[#0022FF] focus:ring-blue-100"
                    }`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-600 dark:text-neutral-400">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary for the article thumbnail/card..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#0022FF]"
                />
              </div>
            </div>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Full Article Content Textarea */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-600 dark:text-neutral-400">
              Full Article Content <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-neutral-400 mb-2">Separate paragraphs by pressing Enter twice.</p>
            <textarea
              value={contentStr}
              onChange={(e) => { setContentStr(e.target.value); setErrors((prev) => ({ ...prev, content: undefined })); }}
              placeholder="Start writing your article content here..."
              rows={12}
              className={`w-full px-3 py-3 rounded-lg text-sm resize-none bg-neutral-50 dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 leading-relaxed focus:outline-none focus:ring-2 ${errors.content ? "border-red-400 focus:ring-red-100" : "border-neutral-200 dark:border-neutral-700 focus:border-[#0022FF] focus:ring-blue-100"
                }`}
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900/30 rounded-b-2xl">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium hover:bg-white dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 h-10 rounded-xl text-sm font-semibold text-white bg-[#0022FF] hover:bg-[#0017AA] dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee] transition-colors shadow-sm">
            {isEdit ? "Save Changes" : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ article, onConfirm, onCancel }: { article: Article; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-[400px] p-6 rounded-2xl shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-center animate-modal-in">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-950 mx-auto mb-3">
          <Trash2 size={20} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">Delete Article?</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 px-2 leading-relaxed">
          Are you sure you want to permanently delete the article <strong>&quot;{article.title}&quot;</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component Workspace ─────────────────────────────────────────────────

export default function CrafterArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(articleList);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modal, setModal] = useState<ModalState>(null);

  // ── Filter Logic ──
  const filteredArticles = useMemo(() => {
    const q = search.toLowerCase().trim();
    return articles.filter((a) => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.author.name.toLowerCase().includes(q);
      const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [articles, search, categoryFilter]);

  // ── Handlers ──
  const handleSave = (data: Partial<Article>) => {
    if (modal?.type === "edit") {
      setArticles((prev) =>
        prev.map((a) => (a.id === modal.article.id ? { ...a, ...data } : a))
      );
    } else {
      const newArticle: Article = {
        id: String(Date.now()),
        title: data.title ?? "",
        slug: data.slug ?? "",
        excerpt: data.excerpt ?? "",
        content: data.content ?? ["Content has not been added yet..."],
        image: data.image ?? "/assets/img/category-1.png",
        category: data.category ?? "Kerajinan",
        tags: [],
        author: { name: "Sari Dewi", role: "Crafter" },
        publishedAt: new Date().toISOString().split("T")[0],
        readTime: data.readTime ?? 3,
        likes: 0,
        dislikes: 0,
        isFeatured: false,
      };
      setArticles((prev) => [newArticle, ...prev]);
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setArticles((prev) => prev.filter((a) => a.id !== modal.article.id));
    setModal(null);
  };

  const toggleFeatured = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a))
    );
  };

  return (
    <>
      <SellerHeader
        title="Articles"
        description="Manage your article."
        actions={
          <button
            onClick={() => setModal({ type: "add" })}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white bg-[#0022FF] hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Write Article</span>
            <span className="sm:hidden">Add</span>
          </button>
        }
      />
      <main className="flex-1 p-3 sm:p-6 overflow-auto">
        {/* Workspace Card */}
        <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 overflow-hidden">

          {/* Toolbar Control Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[140px] max-w-[320px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search article title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                title="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF] cursor-pointer transition-all"
              >
                <option value="All">All Categories</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Dekorasi">Dekorasi</option>
                <option value="Aksesori">Aksesori</option>
                <option value="Kado">Kado</option>
                <option value="Bisnis">Bisnis</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {["Thumbnail", "Article Details", "Category", "Author", "Engagement", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 whitespace-nowrap ${i === 6 ? "text-right pr-6" : ""
                        }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredArticles.length === 0 ? (
                  /* Empty State Handler */
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800/60 ring-1 ring-neutral-100 dark:ring-neutral-800">
                          <FolderOpen size={24} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">No articles found</p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm">Try adjusting your search keywords or start creating your first published article content.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr
                      key={art.id}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          {art.image ? (
                            <img src={art.image} alt="cover" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={14} className="m-auto text-neutral-400 h-full w-full p-3" />
                          )}
                        </div>
                      </td>

                      {/* Title and Excerpt */}
                      <td className="px-4 py-3.5 max-w-[300px]">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate" title={art.title}>
                          {art.title}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                          {art.excerpt}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {art.category}
                        </span>
                      </td>

                      {/* Author Specs */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">{art.author.name}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{art.author.role}</p>
                      </td>

                      {/* Interaction / Engagement */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-neutral-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <ThumbsUp size={12} /> {art.likes}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-400">
                            <ThumbsDown size={12} /> {art.dislikes}
                          </span>
                        </div>
                      </td>

                      {/* Operation Action Buttons */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setModal({ type: "edit", article: art })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-[#0022FF] hover:bg-blue-50 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Edit Article"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", article: art })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Article"
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

      {/* Render Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <ArticleFormModal
          initial={modal.type === "edit" ? modal.article : undefined}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirmModal
          article={modal.article}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Slide Modal Transition Animations */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </>
  );
}