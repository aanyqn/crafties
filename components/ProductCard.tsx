import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";

export type Product = {
  id: string;
  name: string;
  price: string;
  badge: string; // seller / store name
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="w-full aspect-square bg-neutral-100 relative overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          {/* Category pill */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-1 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0022FF]">
            {product.badge}
          </span>
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-[#0022FF] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={product.rating} size={12} />
            <span className="text-xs text-neutral-400">({product.reviewCount})</span>
          </div>
          <p className="text-sm font-bold text-neutral-900 mt-auto pt-2">{product.price}</p>
        </div>
      </article>
    </Link>
  );
}
