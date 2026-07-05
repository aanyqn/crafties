import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";

import { Product } from "@/types/product";
import { formatPrice } from "@/data/mockProducts";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <article className="rounded-xl overflow-hidden border transition-all duration-300
                          hover:-translate-y-1.5 cursor-pointer h-full flex flex-col
                          bg-white dark:bg-neutral-900
                          border-neutral-200 dark:border-neutral-800
                          hover:shadow-2xl dark:hover:shadow-neutral-800/60">

        {/* Image */}
        <div className="w-full aspect-square relative overflow-hidden flex-shrink-0
                        bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          {/* Category pill */}
          <span className="absolute top-3 left-3 backdrop-blur-sm text-xs font-semibold
                           px-2.5 py-1 rounded-full border
                           bg-white/90 dark:bg-neutral-900/80
                           text-neutral-700 dark:text-neutral-300
                           border-neutral-200 dark:border-neutral-700">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-1 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider
                           text-[#0022FF] dark:text-[#4d6bff]">
            {product.badge}
          </span>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 transition-colors
                         text-neutral-900 dark:text-neutral-100
                         group-hover:text-[#0022FF] dark:group-hover:text-[#4d6bff]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={product.rating} size={12} />
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              ({product.reviewCount})
            </span>
          </div>
          <p className="text-sm font-bold mt-auto pt-2
                        text-neutral-900 dark:text-neutral-100">
            {formatPrice(product.price)}
          </p>
        </div>

      </article>
    </Link>
  );
}