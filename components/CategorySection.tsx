import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "cat-1", label: "Decorations", href: "/products?category=decorations", src: "/assets/img/category-1.png", alt: "Decorations category" },
  { id: "cat-2", label: "Accessories", href: "/products?category=accessories", src: "/assets/img/category-2.png", alt: "Accessories category" },
  { id: "cat-3", label: "Toys",        href: "/products?category=toys",        src: "/assets/img/category-3-v2.png", alt: "Toys category" },
  { id: "cat-4", label: "Gifts",       href: "/products?category=gifts",       src: "/assets/img/category-4.png", alt: "Gifts category" },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-white" id="section-category" aria-labelledby="category-heading">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight leading-tight" id="category-heading">
            Shop by Category
          </h2>
          <div className="flex items-center gap-2">
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                aria-label={`${dir === "prev" ? "Previous" : "Next"} categories`}
                className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-full bg-white text-neutral-600 hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {dir === "prev"
                    ? <polyline points="15 18 9 12 15 6" />
                    : <polyline points="9 18 15 12 9 6" />}
                </svg>
              </button>
            ))}
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
              <div className="w-full aspect-square bg-neutral-100 rounded-2xl overflow-hidden transition-all duration-300 relative border border-neutral-200 group-hover:border-[#0022FF] group-hover:shadow-lg group-hover:ring-2 group-hover:ring-[#0022FF]/20">
                <Image
                  src={cat.src}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-125"
                />
              </div>
              <span className="text-sm font-semibold text-neutral-800 text-center tracking-tight group-hover:text-[#0022FF] transition-colors duration-200">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
