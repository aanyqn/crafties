import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "cat-1", label: "Decorations", href: "/products?category=decorations", src: "/assets/img/category-1.png",    alt: "Decorations category" },
  { id: "cat-2", label: "Accessories", href: "/products?category=accessories", src: "/assets/img/category-2.png",    alt: "Accessories category" },
  { id: "cat-3", label: "Toys",        href: "/products?category=toys",        src: "/assets/img/category-3-v2.png", alt: "Toys category" },
  { id: "cat-4", label: "Gifts",       href: "/products?category=gifts",       src: "/assets/img/category-4.png",    alt: "Gifts category" },
];

export default function CategorySection() {
  return (
    <section
      className="py-16 bg-white dark:bg-neutral-950"
      id="section-category"
      aria-labelledby="category-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            id="category-heading"
            className="text-2xl font-bold tracking-tight leading-tight
                       text-neutral-900 dark:text-neutral-100"
          >
            Shop by Category
          </h2>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors whitespace-nowrap"
            >
              <button
                aria-label="Explore"
                className="p-2 flex items-center justify-center border border-neutral-200 rounded-3xl bg-white dark:bg-neutral-800 dark:text-white dark:border-neutral-600 hover:border-[#0022ff] text-neutral-800 hover:text-[#0022ff] transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm flex items-center">
                  Explore More <ChevronRight size={15} />
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              aria-label={`Browse ${cat.label}`}
            >
              <div
                className="w-full aspect-square rounded-2xl overflow-hidden relative
                           transition-all duration-300
                           bg-neutral-100 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           group-hover:border-[#0022FF] group-hover:shadow-lg
                           group-hover:ring-2 group-hover:ring-[#0022FF]/20"
              >
                <Image
                  src={cat.src}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-125"
                />
              </div>

              <span
                className="text-sm font-semibold text-center tracking-tight
                           text-neutral-800 dark:text-neutral-200
                           group-hover:text-[#0022FF] transition-colors duration-200"
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}