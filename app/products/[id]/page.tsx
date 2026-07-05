"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import RatingBar from "@/components/RatingBar";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, Store } from "lucide-react";

import { getProductDetail } from "@/types/productDetail";
import { formatPrice } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = ["#0022FF", "#7A8BFF", "#0017AA", "#444444", "#666666"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductDetail(id);

  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <h1>Product not found</h1>
        </main>
        <Footer />
      </>
    );
  }

  const totalReviews = Object.values(product.ratingDist).reduce((a, b) => a + b, 0);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.product.name,
      price: product.product.price,
      image: product.images[0],
      store: product.product.badge,
      selectedVariants,
      quantity: qty,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5] dark:bg-neutral-900">
        <div className="max-w-[1200px] mx-auto px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0022FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0022FF] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium line-clamp-1 max-w-[200px]">{product.product.name}</span>
          </nav>

          {/* ── Top Section: Gallery + Info ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mb-10">

            {/* Image Gallery */}
            <div className="flex flex-col gap-3">
              {/* Main image */}
              <div className="w-full aspect-square bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative">
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.product.name} - gambar ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-opacity duration-300"
                  priority
                />
                {/* Stock badge */}
                {product.total_stock < 10 && (
                  <span className="absolute top-4 left-4 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                    Stok terbatas — {product.total_stock} tersisa
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${i === activeImage
                      ? "border-[#0022FF] shadow-md"
                      : "border-transparent hover:border-neutral-300"
                      }`}
                    aria-label={`Gambar ${i + 1}`}
                    aria-pressed="true"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col gap-5">
              {/* Name & price */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0022FF] mb-1 block">
                  {product.product.category}
                </span>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white leading-snug font-[family-name:var(--font-display)] mb-2">
                  {product.product.name}
                </h1>
                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={product.product.rating} size={15} showValue />
                  <span className="text-xs text-neutral-400">({product.product.reviewCount} reviews)</span>
                  <span className="text-xs text-neutral-300 dark:text-neutral-500">·</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-300">{product.total_stock} stocks</span>
                </div>
                <p className="text-2xl font-extrabold dark:text-neutral-100 text-neutral-900">{formatPrice(product.product.price)}</p>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-900" />

              {/* Variants */}
              {product.variants.map((variant) => (
                <div key={variant.label}>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-300 mb-2">
                    {variant.label}
                    {selectedVariants[variant.label] && (
                      <span className="ml-2 font-normal normal-case tracking-normal text-neutral-700 dark:text-neutral-400">
                        — {selectedVariants[variant.label]}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.label]:
                              prev[variant.label] === opt.name ? "" : opt.name,
                          }))
                        }
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${selectedVariants[variant.label] === opt.name
                          ? "bg-[#0022FF] text-white border-[#0022FF] shadow-md"
                          : "bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-[#0022FF] hover:text-[#0022FF]"
                          }`}
                        aria-pressed="true"
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-neutral-100 dark:border-neutral-900" />

              {/* Quantity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-300 mb-2">Amount</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 transition-colors cursor-pointer"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-100" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.total_stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 transition-colors cursor-pointer"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">Max. {product.total_stock} pcs</span>
                </div>
              </div>

              {/* CTA */}
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${addedToCart
                  ? "bg-green-500 text-white scale-[0.98]"
                  : "bg-[#0022FF] text-white hover:bg-[#0017AA] hover:shadow-lg active:scale-[0.98]"
                  }`}
                aria-live="polite"
              >
                {addedToCart ? "Added to cart" : "Add to cart"}
              </button>

              <div className="border-t border-neutral-100 dark:border-neutral-900" />

              {/* Seller info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0022FF]/50 flex items-center justify-center flex-shrink-0">
                  <Store className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{product.seller.name}</p>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={product.seller.rating} size={11} />
                    <span className="text-xs text-neutral-400 truncate">{product.seller.location}</span>
                  </div>
                </div>
                <Link
                  href={`/seller/${product.seller.id}`}
                  className="flex-shrink-0 text-xs font-semibold text-[#0022FF] hover:underline underline-offset-2 whitespace-nowrap"
                >
                  <span className="flex items-center">
                    Visit <ChevronRight size={15}/>
                  </span>
                </Link>
              </div>

              {/* Description */}
              <div className="border-t border-neutral-100 dark:border-neutral-900 pt-1 mt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-300 mb-2">Description</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Section: Reviews + Similar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

            {/* Reviews */}
            <section aria-labelledby="reviews-heading">
              <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 id="reviews-heading" className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
                  Reviews
                </h2>

                {/* Summary */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-900">
                  {/* Overall score */}
                  <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
                    <span className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{product.product.rating.toFixed(1)}</span>
                    <StarRating rating={product.product.rating} size={10} />
                    <span className="text-xs text-neutral-400 mt-1">{totalReviews} reviews</span>
                  </div>
                  {/* Distribution bars */}
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {([5, 4, 3, 2, 1] as const).map((star) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={product.ratingDist[star]}
                        total={totalReviews}
                      />
                    ))}
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="flex flex-col gap-4">
                  {product.reviews.map((review) => (
                    <article key={review.id} className="flex gap-3">
                      <AvatarInitials name={review.author} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{review.author}</span>
                          <StarRating rating={review.rating} size={10} />
                          <span className="text-xs text-neutral-400 dark:text-neutral-600 ml-auto">{review.date}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{review.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load more placeholder */}
                {product.product.reviewCount > product.reviews.length && (
                  <div className="flex justify-center mt-8">
                    <button className="px-6 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-[#0022FF] hover:text-[#0022FF] transition-colors cursor-pointer">
                      See All {product.product.reviewCount} Reviews
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Similar Products */}
            <aside aria-labelledby="similar-heading">
              <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 id="similar-heading" className="text-base font-bold text-neutral-900 dark:text-white mb-4">
                  Similar Product
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.similar.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0022FF] hover:underline underline-offset-2"
                  >
                    See All Product →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
