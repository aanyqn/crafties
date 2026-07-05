"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import { ChevronRight, Search, SearchX, Store, X } from "lucide-react"
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { MOCK_SELLERS } from "@/data/mockSellers";



const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Lowest" },
  { value: "price_desc", label: "Price: Highest" },
  { value: "rating", label: "Highest Rating" },
];

const ITEMS_PER_PAGE = 12;

const CATEGORY_MAP: Record<string, string> = {
  decorations: "Decorations",
  accessories: "Accessories",
  toys: "Toys",
  gifts: "Gifts",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const initialSearch =
    searchParams.get("search") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    minPrice: "",
    maxPrice: "",
    rating: 0,
  });
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Filter + Sort ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.badge.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      const cat = CATEGORY_MAP[filters.category];
      if (cat) result = result.filter((p) => p.category === cat);
    }

    if (filters.minPrice) {
      const min = parseInt(filters.minPrice, 10);
      result = result.filter((p) => p.price >= min);
    }
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice, 10);
      result = result.filter((p) => p.price <= max);
    }

    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    switch (sort) {
      case "price_asc": result.sort((a, b) => (a.price) - (b.price)); break;
      case "price_desc": result.sort((a, b) => (b.price) - (a.price)); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => parseInt(b.id) - parseInt(a.id)); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const seller = MOCK_SELLERS.filter((s) => s.name === filtered[0]?.badge);

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5] dark:bg-neutral-900">
        {/* ── Page Header ── */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:dark:border-neutral-800">
          <div className="max-w-[1200px] mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-[family-name:var(--font-display)] tracking-tight">
              {CATEGORY_MAP[filters.category] ?? "All Categories"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Find interesting products crafted by profesionals crafter
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex gap-8 items-start">

            {/* ── Desktop Filter Sidebar ── */}
            <div className="hidden lg:block w-56 flex-shrink-0 top-[128px]">
              <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-900 p-5 overflow-y-auto max-h-[calc(100vh-148px)] scrollbar-thin">
                <FilterSidebar filters={filters} onChange={handleFilterChange} />
              </div>
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-[180px] max-w-sm relative">
                  <input
                    id="catalog-search"
                    type="search"
                    placeholder="Search products or stores..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full h-10 pl-4 pr-10 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white focus:dark:bg-neutral-950 transition-colors"
                    aria-label="Search products"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <Search size={15} />
                  </span>
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 h-10 px-4 bg-white dark:bg-neutral-950 dark:border-neutral-800 border border-neutral-200 b rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-[#0022FF] hover:text-[#0022FF] transition-colors cursor-pointer"
                  aria-expanded="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" />
                    <line x1="12" y1="18" x2="20" y2="18" />
                  </svg>
                  Filter
                </button>

                {/* Sort */}
                <div className="relative ml-auto">
                  <select
                    id="catalog-sort"
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="h-10 pl-4 pr-8 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF] appearance-none cursor-pointer"
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>

                {/* Result count */}
                <p className="text-sm text-neutral-500 whitespace-nowrap">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filtered.length}</span> produk ditemukan
                </p>
              </div>

              {/* Product Grid */}
              {paginated.length === 0 ? (
                <EmptyState onReset={() => { setFilters({ category: "all", minPrice: "", maxPrice: "", rating: 0 }); setSearch(""); }} />
              ) : (
                <div>
                  {search.trim().length > 0 && seller && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-[#0022FF]/50 flex items-center justify-center flex-shrink-0">
                        <Store className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {paginated[0].badge}
                        </p>
                      </div>
                      <Link
                        href={`/seller/${paginated[0].sellerId}`}
                        className="flex-shrink-0 text-xs font-semibold text-[#0022FF] hover:underline underline-offset-2 whitespace-nowrap"
                      >
                        <span className="flex items-center"> Visit <ChevronRight size={15} /> </span>
                      </Link>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                    {paginated.map((product) => (

                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <PaginationButton
                    label="←"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${pg === currentPage
                        ? "bg-[#0022FF] text-white shadow-md"
                        : "bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 dark:text-neutral-400 text-neutral-600 hover:border-[#0022FF] hover:text-[#0022FF]"
                        }`}
                      aria-label={`Page ${pg}`}
                      aria-current={pg === currentPage ? "page" : undefined}
                    >
                      {pg}
                    </button>
                  ))}
                  <PaginationButton
                    label="→"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile Filter Drawer ── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[300] flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="relative ml-auto w-[280px] h-full bg-white dark:bg-neutral-950 shadow-2xl flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Filter</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  aria-label="Close filter drawer"
                >
                  <X />
                </button>
              </div>
              <div className="p-5 flex-1">
                <FilterSidebar filters={filters} onChange={(f) => { handleFilterChange(f); setSidebarOpen(false); }} />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PaginationButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-full bg-white dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-400 border border-neutral-200 text-neutral-600 text-sm font-medium hover:border-[#0022FF] hover:text-[#0022FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      aria-label={label === "←" ? "Previous page" : "Next page"}
    >
      {label}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center mb-5">
        <SearchX className="text-neutral-900 dark:text-neutral-100" size={40}/>
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">Product Not Found</h3>
      <p className="text-sm text-neutral-500 max-w-xs mb-6">
        Try another keywords.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2.5 bg-[#0022FF] text-white text-sm font-semibold rounded-full hover:bg-[#0017AA] transition-colors cursor-pointer"
      >
        Reset Filter
      </button>
    </div>
  );
}
