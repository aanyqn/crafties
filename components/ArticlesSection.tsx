"use client";

import Image from "next/image";

// Data Dummy untuk Artikel Utama (Featured)
const featuredArticle = {
  title: "5 Cara Mudah Menata Dekorasi Rajut untuk Ruang Tamu Minimalis",
  desc: "Sentuhan rajutan tangan atau amigurumi tidak hanya membuat ruangan terasa hangat, tetapi juga menambahkan estetika estetik yang unik dan personal.",
  src: "/assets/img/article-featured.jpg", // Ganti dengan path foto Anda
  alt: "Dekorasi rajut ruang tamu",
};

// Data Dummy untuk Artikel Sampingan (Sidebar)
const sidebarArticles = [
  {
    id: "article-small-1",
    title: "Mengenal Teknik Amigurumi bagi Pemula: Dari Simpul hingga Jadi Boneka",
    desc: "Panduan praktis langkah demi langkah belajar merajut boneka imut tanpa pusing.",
    src: "/assets/img/article-thumb.jpg",
    alt: "Belajar teknik amigurumi",
  },
  {
    id: "article-small-2",
    title: "Pilihan Hadiah Ulang Tahun Unik: Mengapa Aksesoris Handmade Lebih Berkesan?",
    desc: "Barang buatan tangan membawa pesan emosional mendalam yang tidak bisa dibeli di toko massal.",
    src: "/assets/img/article-thumb.jpg",
    alt: "Kado aksesoris handmade",
  },
  {
    id: "article-small-3",
    title: "Tips Merawat Mainan dan Boneka Rajut Agar Warnanya Tidak Cepat Pudar",
    desc: "Simak cara mencuci dan menjemur kerajinan benang rajut kesayangan Anda dengan aman.",
    src: "/assets/img/article-thumb.jpg",
    alt: "Merawat boneka rajut",
  },
];

export default function ArticlesSection() {
  return (
    <section className="py-16 bg-neutral-100" id="section-articles" aria-labelledby="articles-heading">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight" id="articles-heading">
            Inspirasi & Artikel
          </h2>
          <div className="flex items-center gap-2">
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                aria-label={`${dir === "prev" ? "Previous" : "Next"} articles`}
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

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Featured Article */}
          <article className="relative rounded-2xl overflow-hidden cursor-pointer min-h-[380px] bg-neutral-200 group shadow-sm">
            {/* Background Image Placeholder / Real Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={featuredArticle.src}
                alt={featuredArticle.alt}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-500 ease-in-out"
                fallback-src="/assets/img/placeholder.jpg" // Opsional jika belum ada foto asli
              />
            </div>
            
            {/* Gradient Overlay - Dibuat sedikit lebih gelap di bawah agar tulisan panjang terbaca jelas */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            
            {/* Body */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
              <span className="inline-block bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
                Sorotan Utama
              </span>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">
                {featuredArticle.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-4">
                {featuredArticle.desc}
              </p>
              <a
                href="#"
                className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full border border-white text-white hover:bg-white hover:text-neutral-900 transition-all duration-200"
              >
                Baca Selengkapnya
              </a>
            </div>
          </article>

          {/* Sidebar Articles */}
          <aside className="flex flex-col gap-2 justify-between" aria-label="More articles">
            {sidebarArticles.map((article) => (
              <article
                key={article.id}
                className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-4 items-center p-3 cursor-pointer hover:bg-white hover:shadow-white transition-all duration-200 group hover:border-neutral-200/60"
              >
                {/* Thumbnail Image Container */}
                <div className="w-[100px] h-[75px] sm:w-[130px] sm:h-[90px] bg-neutral-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={article.src}
                    alt={article.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Text Description */}
                <div className="pr-2">
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {article.desc}
                  </p>
                </div>
              </article>
            ))}
          </aside>

        </div>
      </div>
    </section>
  );
}