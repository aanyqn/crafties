"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Gelang Manik Bintang", price: "Rp 28.000", badge: "Haruna Craft", rating: 4.8, reviewCount: 132, category: "Accessories", image: "/assets/img/popular-img1.jpg" },
  { id: "2", name: "Vas Bunga Rotan Aestetik", price: "Rp 108.000", badge: "Gamora Studio", rating: 4.5, reviewCount: 87, category: "Decorations", image: "/assets/img/popular-img2.jpg" },
  { id: "3", name: "Gantungan Kunci Beruang Rajut", price: "Rp 26.000", badge: "Arcane Knit", rating: 4.9, reviewCount: 215, category: "Toys", image: "/assets/img/popular-img3.jpg" },
  { id: "4", name: "Anyaman Keranjang Rotan", price: "Rp 65.000", badge: "Haruna Craft", rating: 4.2, reviewCount: 41, category: "Decorations", image: "/assets/img/category-1.png" },
  { id: "5", name: "Kalung Manik Bohemian", price: "Rp 45.000", badge: "Blossom Beads", rating: 4.6, reviewCount: 98, category: "Accessories", image: "/assets/img/category-2.png" },
  { id: "6", name: "Boneka Amigurumi Kucing", price: "Rp 79.000", badge: "Arcane Knit", rating: 5.0, reviewCount: 320, category: "Toys", image: "/assets/img/category-3-v2.png" },
  { id: "7", name: "Hamper Kado Ulang Tahun", price: "Rp 155.000", badge: "Gifted Box", rating: 4.7, reviewCount: 62, category: "Gifts", image: "/assets/img/category-4.png" },
  { id: "8", name: "Bingkai Foto Bambu Custom", price: "Rp 92.000", badge: "Gamora Studio", rating: 3.9, reviewCount: 29, category: "Decorations", image: "/assets/img/hero-image2.jpg" },
  { id: "9", name: "Tas Rajut Casual Mini", price: "Rp 135.000", badge: "Blossom Beads", rating: 4.4, reviewCount: 74, category: "Accessories", image: "/assets/img/hero-image3.jpg" },
  { id: "10", name: "Set Lilin Aromaterapi", price: "Rp 88.000", badge: "Gifted Box", rating: 4.6, reviewCount: 111, category: "Gifts", image: "/assets/img/article-thumb.jpg" },
  { id: "11", name: "Tempat Pensil Rajut Lucu", price: "Rp 38.000", badge: "Arcane Knit", rating: 4.3, reviewCount: 55, category: "Toys", image: "/assets/img/popular-img1.jpg" },
  { id: "12", name: "Cermin Dinding Rotan Oval", price: "Rp 195.000", badge: "Haruna Craft", rating: 4.7, reviewCount: 88, category: "Decorations", image: "/assets/img/popular-img2.jpg" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Lowest" },
  { value: "price_desc", label: "Price: Highest" },
  { value: "rating", label: "Highest Rating" },
];

const ITEMS_PER_PAGE = 9;

// Helper: parse "Rp X.XXX" → number
const parsePriceNum = (price: string) =>
  parseInt(price.replace(/[^0-9]/g, ""), 10);

const CATEGORY_MAP: Record<string, string> = {
  decorations: "Decorations",
  accessories: "Accessories",
  toys: "Toys",
  gifts: "Gifts",
};

// ── Page ───────────────────────────────────────────────────────────────────
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
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      const cat = CATEGORY_MAP[filters.category];
      if (cat) result = result.filter((p) => p.category === cat);
    }

    if (filters.minPrice) {
      const min = parseInt(filters.minPrice, 10);
      result = result.filter((p) => parsePriceNum(p.price) >= min);
    }
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice, 10);
      result = result.filter((p) => parsePriceNum(p.price) <= max);
    }

    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    switch (sort) {
      case "price_asc": result.sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price)); break;
      case "price_desc": result.sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price)); break;
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

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5]">
        {/* ── Page Header ── */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-[1200px] mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 font-[family-name:var(--font-display)] tracking-tight">
              {CATEGORY_MAP[filters.category] ?? "All Categories"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Temukan kerajinan tangan terbaik dari para pengrajin lokal Indonesia
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex gap-8 items-start">

            {/* ── Desktop Filter Sidebar ── */}
            <div className="hidden lg:block w-56 flex-shrink-0 top-[128px]">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm overflow-y-auto max-h-[calc(100vh-148px)] scrollbar-thin">
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
                    placeholder="Cari produk, toko..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full h-10 pl-4 pr-10 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white transition-colors shadow-sm"
                    aria-label="Search products"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 h-10 px-4 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:border-[#0022FF] hover:text-[#0022FF] transition-colors shadow-sm cursor-pointer"
                  aria-expanded={sidebarOpen}
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
                    className="h-10 pl-4 pr-8 bg-white border border-neutral-200 rounded-full text-sm text-neutral-700 focus:outline-none focus:border-[#0022FF] appearance-none shadow-sm cursor-pointer"
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
                  <span className="font-semibold text-neutral-900">{filtered.length}</span> produk ditemukan
                </p>
              </div>

              {/* Product Grid */}
              {paginated.length === 0 ? (
                <EmptyState onReset={() => { setFilters({ category: "all", minPrice: "", maxPrice: "", rating: 0 }); setSearch(""); }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
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
                        : "bg-white border border-neutral-200 text-neutral-600 hover:border-[#0022FF] hover:text-[#0022FF]"
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
            <div className="relative ml-auto w-[280px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 flex-shrink-0">
                <h2 className="text-base font-bold text-neutral-900">Filter</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  aria-label="Close filter drawer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
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
      className="w-9 h-9 rounded-full bg-white border border-neutral-200 text-neutral-600 text-sm font-medium hover:border-[#0022FF] hover:text-[#0022FF] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      aria-label={label === "←" ? "Previous page" : "Next page"}
    >
      {label}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
          fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" /></svg>
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">Produk tidak ditemukan</h3>
      <p className="text-sm text-neutral-500 max-w-xs mb-6">
        Coba ubah kata kunci pencarian atau sesuaikan filter yang kamu gunakan.
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
