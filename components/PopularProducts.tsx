import Link from "next/link";
import Image from "next/image";
import ProductCard from "./ProductCard";
import { ChevronRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";


export default function PopularProducts() {
  return (
    <section
      className="py-16 relative bg-neutral-800 bg-cover bg-center bg-no-repeat dark:bg-neutral-950"
      style={{ backgroundImage: "url('/assets/img/popular-bg.jpg')" }}
      id="section-popular"
      aria-labelledby="popular-heading"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-center">

          {/* Intro */}
          <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4">
            <h2
              className="text-2xl font-bold text-white leading-tight font-[family-name:var(--font-display)]"
              id="popular-heading"
            >
              Popular<br className="hidden lg:block" /> Products
            </h2>
            <Link
              href="/products"
              className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors whitespace-nowrap"
            >
              <button
                aria-label="Explore"
                className="p-2 flex items-center justify-center border border-neutral-200 rounded-3xl bg-white dark:bg-neutral-800 dark:text-white dark:border-neutral-600 hover:border-[#0022ff] text-neutral-800 hover:text-[#0022ff] transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm flex items-center">
                  See More <ChevronRight size={15} />
                </span>
              </button>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tips tambahan: Mengubah sm:grid-cols-3 menjadi sm:grid-cols-2 agar di tablet tidak terlalu sempit */}
            {MOCK_PRODUCTS
              .filter((product) => product.isFeatured)
              .slice(0,3)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

        </div>
      </div>
    </section>
  );
}
