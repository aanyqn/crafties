import { MOCK_PRODUCTS } from "@/data/mockProducts";
import ProductCard from "@/components/ProductCard";
import { Package, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface Props {
  sellerId: string;
}

export default function SellerProducts({ sellerId }: Props) {
  const products = MOCK_PRODUCTS.filter((p) => p.sellerId === sellerId);

  if (!products.length) {
    return (
      <div className="rounded-2xl border py-16 px-6 text-center
                      bg-white dark:bg-neutral-950
                      border-neutral-200 dark:border-neutral-800">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                        bg-neutral-100 dark:bg-neutral-800">
          <Package size={22} className="text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          No Products
        </p>
      </div>
    );
  }
  const searchParams = useSearchParams();
  const initialSearch =
    searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.badge.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search]);


  return (
    <>
      <div className="flex-1 min-w-[180px] max-w-sm relative ">
        <input
          id="catalog-search"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full h-10 pl-4 pr-10 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white focus:dark:bg-neutral-950 transition-colors"
          aria-label="Search products"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <Search size={15} />
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}