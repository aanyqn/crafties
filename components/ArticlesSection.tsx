"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  ARTICLES,
} from "@/data/mockArticles";


export default function ArticlesSection() {
  return (
    <section className="py-16 bg-neutral-100 dark:bg-neutral-950" id="section-articles" aria-labelledby="articles-heading">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight dark:text-neutral-100" id="articles-heading">
            Articles
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href="/articles"
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
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Featured Article */}
          {ARTICLES.filter((article) => article.isFeatured).slice(0, 1).map((article) => (
            <Link href={`/articles/${article.slug}`} key={article.id}>
              <article className="relative rounded-2xl overflow-hidden cursor-pointer min-h-[380px] bg-neutral-200 group shadow-sm">
                {/* Background Image Placeholder / Real Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={article.image}
                    alt="gambar"
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
                    Featured
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <Link href={`/articles/${article.slug}`} key={article.id} className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full border border-white text-white hover:bg-white hover:text-neutral-900 transition-all duration-200">
                    Read More
                  </Link>
                </div>
              </article>
            </Link>
          ))}

          {/* Sidebar Articles */}
          <aside className="flex flex-col gap-2 justify-between" aria-label="More articles">
            {ARTICLES.slice(1, 4).map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id}>
                <article
                  key={article.id}
                  className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-4 items-center p-3 cursor-pointer hover:dark:bg-neutral-850 hover:shadow-white transition-all duration-200 group hover:border-neutral-200/60"
                >
                  <div className="w-[100px] h-[75px] sm:w-[130px] sm:h-[90px] bg-neutral-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={article.image}
                      alt="gambar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text Description */}
                  <div className="pr-2">
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-neutral-100">
                      {article.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </aside>

        </div>
      </div>
    </section>
  );
}