import Link from "next/link";
import Image from "next/image";

const products = [
  { id: "1", src: "/assets/img/popular-img1.jpg", alt: "popular-image", name: "Gelang Bintang", price: "Rp. 28.000", badge: "haruna" },
  { id: "2", src: "/assets/img/popular-img2.jpg", alt: "popular-image", name: "Vas Bunga Aestetik", price: "Rp. 108.000", badge: "gamora" },
  { id: "3", src: "/assets/img/popular-img3.jpg", alt: "popular-image", name: "Gantungan Kunci Beruang", price: "Rp. 26.000", badge: "arcane" },
];

export default function PopularProducts() {
  return (
    <section
      className="py-16 relative bg-neutral-800 bg-cover bg-center bg-no-repeat"
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
              className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors whitespace-nowrap underline-offset-2 hover:underline"
            >
              See More →
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tips tambahan: Mengubah sm:grid-cols-3 menjadi sm:grid-cols-2 agar di tablet tidak terlalu sempit */}
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group block"
              >
                {/* 1. Mengubah bingkai luar menjadi aspect-square (1:1) dan menambahkan properti relative */}
                <div className="w-full aspect-square bg-neutral-100 relative overflow-hidden">
                  {/* 2. Menggunakan Next.js Image dengan properti fill dan object-cover */}
                  <Image
                    src={product.src}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>

                <div className="p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {product.badge}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-tight mt-1 mb-2 group-hover:text-blue-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-neutral-500">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
