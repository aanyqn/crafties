import Image from "next/image";
import Link from "next/link";
import { Seller } from "@/types/seller";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import StarRating from "@/components/StarRating";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import {
  Flame, Sparkles, Package,
  ArrowRight, ShoppingBag, Tag,
} from "lucide-react";

interface Props {
  seller: Seller;
}

// ── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({
  title, icon, href,
}: {
  title: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base font-bold
                       text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-semibold
                     transition-opacity hover:opacity-70
                     text-[#0022FF] dark:text-[#4d6bff]"
        >
          Lihat semua <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ── Promo / Featured Banner Card (kiri featured section) ───────────────────────

function PromoCard({
  image, title, description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative h-full min-h-[200px] rounded-2xl overflow-hidden
                    border border-neutral-200 dark:border-neutral-800
                    bg-neutral-200 dark:bg-neutral-800">

      {/* Promo image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Gradient overlay — bawah lebih gelap untuk keterbacaan teks */}
      <div className="absolute inset-0 bg-gradient-to-t
                      from-black/80 via-black/30 to-black/10" />

      {/* Badge promo */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                         text-[11px] font-bold uppercase tracking-wider
                         bg-[#0022FF] dark:bg-[#4d6bff] text-white">
          <Tag size={10} />
          Promo
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>
        <Link
          href="#"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                     text-xs font-semibold transition-colors
                     bg-white text-neutral-900 hover:bg-neutral-100"
        >
          Lihat Promo
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ── Main Store Component ───────────────────────────────────────────────────────

export default function SellerStore({ seller }: Props) {
  const all = MOCK_PRODUCTS.filter((p) => p.sellerId === seller.id);

  const popular = all.slice(0, 4);
  const other   = all.slice(0, 4); // bisa diubah sesuai kebutuhan

  // Produk terkait promo — cari berdasarkan relatedProductIds
  const promoProducts = seller.promo?.relatedProductIds
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean) as Product[] ?? [];

  if (!all.length) {
    return (
      <div className="rounded-2xl border py-16 px-6 text-center
                      bg-white dark:bg-neutral-950
                      border-neutral-200 dark:border-neutral-800">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                        bg-neutral-100 dark:bg-neutral-800">
          <Package size={22} className="text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Seller belum memiliki toko aktif.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ── Store Banner ── (image dari seller) */}
      <div className="relative rounded-2xl overflow-hidden h-36 sm:h-52
                      bg-neutral-200 dark:bg-neutral-800">

        {/* Banner image — diset oleh seller */}
        <Image
          src={seller.bannerImage}
          alt={`${seller.name} banner`}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />

        {/* Gradient kiri agar teks tetap terbaca */}
        <div className="absolute inset-0
                        bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        {/* Content overlay */}
        <div className="relative h-full flex items-center px-7 sm:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5
                          text-white/50">
              Official Store
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
              {seller.name}
            </h2>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         text-xs font-semibold transition-colors
                         bg-white text-neutral-900 hover:bg-neutral-100"
            >
              <ShoppingBag size={12} />
              Jelajahi Produk
            </Link>
          </div>
        </div>
      </div>

      {/* ── Popular ── */}
      {popular.length > 0 && (
        <section>
          <SectionHeader
            title="Popular"
            icon={<Flame size={15} className="text-orange-500" />}
            href="#"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Featured (Promo + Related Products) ── */}
      {seller.promo && (
        <section>
          <SectionHeader
            title="Featured"
            icon={<Sparkles size={15} className="text-[#0022FF] dark:text-[#4d6bff]" />}
          />
          <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-4 sm:gap-5">
            <div className="sm:col-span-2 col-span-2 h-full">
              <PromoCard
                image={seller.promo.image}
                title={seller.promo.title}
                description={seller.promo.description}
              />
            </div>
            {promoProducts.length > 0
              ? promoProducts.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p}/>
                ))
              : all.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </section>
      )}

      {/* ── Other Products ── */}
      {other.length > 0 && (
        <section>
          <SectionHeader
            title="Other Products"
            icon={<Package size={15} className="text-neutral-500 dark:text-neutral-400" />}
            href="#"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {other.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}