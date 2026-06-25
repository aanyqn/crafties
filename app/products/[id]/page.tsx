"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import RatingBar from "@/components/RatingBar";
import ProductCard, { Product } from "@/components/ProductCard";

// ── Types ──────────────────────────────────────────────────────────────────
type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

type Variant = { label: string; value: string };

type ProductDetail = {
  id: string;
  name: string;
  price: string;
  badge: string;
  rating: number;
  reviewCount: number;
  category: string;
  stock: number;
  images: string[];
  variants: { label: string; options: Variant[] }[];
  description: string;
  sellerName: string;
  sellerRating: number;
  sellerLocation: string;
  ratingDist: Record<number, number>;
  reviews: Review[];
  similar: Product[];
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK: Record<string, ProductDetail> = {
  "1": {
    id: "1",
    name: "Gelang Manik Bintang",
    price: "Rp 28.000",
    badge: "Haruna Craft",
    rating: 4.8,
    reviewCount: 132,
    category: "Accessories",
    stock: 24,
    images: [
      "/assets/img/popular-img1.jpg",
      "/assets/img/popular-img2.jpg",
      "/assets/img/popular-img3.jpg",
      "/assets/img/hero-image2.jpg",
      "/assets/img/hero-image3.jpg",
    ],
    variants: [
      { label: "Size", options: [{ label: "S", value: "s" }, { label: "M", value: "m" }, { label: "L", value: "l" }] },
      { label: "Color", options: [{ label: "Biru Tua", value: "navy" }, { label: "Putih", value: "white" }, { label: "Pastel", value: "pastel" }] },
    ],
    description:
      "Gelang manik-manik handmade berbentuk bintang yang dibuat dengan tangan menggunakan benang elastis berkualitas premium. Cocok untuk hadiah ulang tahun, wisuda, atau sekedar self-reward. Tersedia dalam berbagai pilihan ukuran dan warna cerah yang memukau. Setiap biji manik dipilih dengan teliti untuk memastikan keseragaman warna dan ukuran.",
    sellerName: "Haruna Craft",
    sellerRating: 4.9,
    sellerLocation: "Surabaya, Jawa Timur",
    ratingDist: { 5: 98, 4: 22, 3: 7, 2: 3, 1: 2 },
    reviews: [
      { id: "r1", author: "Annisa R.", avatar: "", rating: 5, date: "10 Juni 2026", text: "Kualitasnya bagus banget! Warnanya persis kayak di foto, pengiriman juga cepat. Sudah order ke 3 kalinya nih 😍" },
      { id: "r2", author: "Dewi P.",   avatar: "", rating: 5, date: "5 Juni 2026",  text: "Sangat rekomen! Harganya murah, tapi kualitasnya tidak murahan. Gelangnya kuat dan tidak cepat putus." },
      { id: "r3", author: "Rizky F.",  avatar: "", rating: 4, date: "1 Juni 2026",  text: "Bagus dan lucu. Cuma waktu pengiriman agak lama, tapi seller responsif kok kalau ditanya." },
      { id: "r4", author: "Maya S.",   avatar: "", rating: 5, date: "28 Mei 2026",  text: "Beli untuk kado ulang tahun teman, dia suka banget! Packagingnya juga rapi dan ada kartu ucapannya." },
      { id: "r5", author: "Faris A.",  avatar: "", rating: 4, date: "22 Mei 2026",  text: "Gelangnya memang cantik dan persis foto. Recommended untuk hadiah!" },
    ],
    similar: [
      { id: "5",  name: "Kalung Manik Bohemian",         price: "Rp 45.000",  badge: "Blossom Beads", rating: 4.6, reviewCount: 98,  category: "Accessories",      image: "/assets/img/category-2.png" },
      { id: "9",  name: "Tas Rajut Casual Mini",          price: "Rp 135.000", badge: "Blossom Beads", rating: 4.4, reviewCount: 74,  category: "Accessories",      image: "/assets/img/hero-image3.jpg" },
      { id: "3",  name: "Gantungan Kunci Beruang Rajut",  price: "Rp 26.000",  badge: "Arcane Knit",   rating: 4.9, reviewCount: 215, category: "Toys", image: "/assets/img/popular-img3.jpg" },
      { id: "7",  name: "Hamper Kado Ulang Tahun",        price: "Rp 155.000", badge: "Gifted Box",    rating: 4.7, reviewCount: 62,  category: "Gifts",  image: "/assets/img/category-4.png" },
    ],
  },
  // fallback filled dynamically below
};

// Generate a fallback for any product id not explicitly defined
function getProduct(id: string): ProductDetail {
  if (MOCK[id]) return MOCK[id];
  // Generic fallback
  return {
    ...MOCK["1"],
    id,
    name: "Produk Kerajinan Tangan",
    price: "Rp 75.000",
    badge: "Crafties Store",
    image: "/assets/img/popular-img2.jpg",
  } as unknown as ProductDetail;
}

// ── Avatar Initials ────────────────────────────────────────────────────────
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
  const product = getProduct(id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const totalReviews = Object.values(product.ratingDist).reduce((a, b) => a + b, 0);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0022FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0022FF] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
          </nav>

          {/* ── Top Section: Gallery + Info ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mb-10">

            {/* Image Gallery */}
            <div className="flex flex-col gap-3">
              {/* Main image */}
              <div className="w-full aspect-square bg-white rounded-2xl border border-neutral-200 overflow-hidden relative shadow-sm">
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.name} - gambar ${activeImage + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-opacity duration-300"
                  priority
                />
                {/* Stock badge */}
                {product.stock < 10 && (
                  <span className="absolute top-4 left-4 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                    Stok terbatas — {product.stock} tersisa
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      i === activeImage
                        ? "border-[#0022FF] shadow-md"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                    aria-label={`Gambar ${i + 1}`}
                    aria-pressed={i === activeImage}
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col gap-5">
              {/* Name & price */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0022FF] mb-1 block">
                  {product.category}
                </span>
                <h1 className="text-2xl font-bold text-neutral-900 leading-snug font-[family-name:var(--font-display)] mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={product.rating} size={15} showValue />
                  <span className="text-xs text-neutral-400">({product.reviewCount} ulasan)</span>
                  <span className="text-xs text-neutral-300">·</span>
                  <span className="text-xs text-neutral-500">{product.stock} stocks</span>
                </div>
                <p className="text-2xl font-extrabold text-neutral-900">{product.price}</p>
              </div>

              <div className="border-t border-neutral-100" />

              {/* Variants */}
              {product.variants.map((variant) => (
                <div key={variant.label}>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    {variant.label}
                    {selectedVariants[variant.label] && (
                      <span className="ml-2 font-normal normal-case tracking-normal text-neutral-700">
                        — {selectedVariants[variant.label]}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.label]:
                              prev[variant.label] === opt.label ? "" : opt.label,
                          }))
                        }
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                          selectedVariants[variant.label] === opt.label
                            ? "bg-[#0022FF] text-white border-[#0022FF] shadow-md"
                            : "bg-white text-neutral-700 border-neutral-200 hover:border-[#0022FF] hover:text-[#0022FF]"
                        }`}
                        aria-pressed={selectedVariants[variant.label] === opt.label}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-neutral-100" />

              {/* Quantity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Amount</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-neutral-900" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">Max. {product.stock} pcs</span>
                </div>
              </div>

              {/* CTA */}
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  addedToCart
                    ? "bg-green-500 text-white scale-[0.98]"
                    : "bg-[#0022FF] text-white hover:bg-[#0017AA] hover:shadow-lg active:scale-[0.98]"
                }`}
                aria-live="polite"
              >
                {addedToCart ? "Added to cart" : "Add to cart"}
              </button>

              <div className="border-t border-neutral-100" />

              {/* Seller info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0022FF]/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="#0022FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{product.sellerName}</p>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={product.sellerRating} size={11} />
                    <span className="text-xs text-neutral-400 truncate">{product.sellerLocation}</span>
                  </div>
                </div>
                <Link
                  href="#"
                  className="flex-shrink-0 text-xs font-semibold text-[#0022FF] hover:underline underline-offset-2 whitespace-nowrap"
                >
                  Visit →
                </Link>
              </div>

              {/* Description */}
              <div className="border-t border-neutral-100 pt-1">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Description</p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Section: Reviews + Similar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

            {/* Reviews */}
            <section aria-labelledby="reviews-heading">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                <h2 id="reviews-heading" className="text-lg font-bold text-neutral-900 mb-6">
                  Reviews
                </h2>

                {/* Summary */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-neutral-100">
                  {/* Overall score */}
                  <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
                    <span className="text-2xl font-extrabold text-neutral-900">{product.rating.toFixed(1)}</span>
                    <StarRating rating={product.rating} size={10} />
                    <span className="text-xs text-neutral-400 mt-1">{totalReviews} reviews</span>
                  </div>
                  {/* Distribution bars */}
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={product.ratingDist[star] ?? 0}
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
                          <span className="text-sm font-semibold text-neutral-900">{review.author}</span>
                          <StarRating rating={review.rating} size={10} />
                          <span className="text-xs text-neutral-400 ml-auto">{review.date}</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{review.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load more placeholder */}
                {product.reviewCount > product.reviews.length && (
                  <div className="flex justify-center mt-8">
                    <button className="px-6 py-2.5 border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:border-[#0022FF] hover:text-[#0022FF] transition-colors cursor-pointer">
                      See All {product.reviewCount} Reviews
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Similar Products */}
            <aside aria-labelledby="similar-heading">
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h2 id="similar-heading" className="text-base font-bold text-neutral-900 mb-4">
                  Similar Product
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.similar.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100">
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
