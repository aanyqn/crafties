"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ARTICLES,
  getFeaturedArticles,
  getNewArticles,
  Article,
} from "@/data/mockArticles";
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Featured card (Top Articles) ─────────────────────────────────────────────

function ArticleFeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden
                      bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider
                           text-white/80 bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2
                           border border-white/20">
            {article.category}
          </span>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-white/60">{article.author.name}</span>
            <span className="text-white/30">·</span>
            <span className="text-[11px] text-white/60">{article.readTime} mnt baca</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Article list item (New Updates / All Articles) ────────────────────────────

function ArticleListItem({ article }: { article: Article }) {
  const [likes, setLikes]       = useState(article.likes);
  const [dislikes, setDislikes] = useState(article.dislikes);
  const [voted, setVoted]       = useState<"like" | "dislike" | null>(null);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (voted === "like") {
      setLikes((p) => p - 1);
      setVoted(null);
    } else {
      if (voted === "dislike") setDislikes((p) => p - 1);
      setLikes((p) => p + 1);
      setVoted("like");
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (voted === "dislike") {
      setDislikes((p) => p - 1);
      setVoted(null);
    } else {
      if (voted === "like") setLikes((p) => p - 1);
      setDislikes((p) => p + 1);
      setVoted("dislike");
    }
  };

  return (
    <div className="flex items-center gap-4 py-5 border-b last:border-b-0
                    border-neutral-100 dark:border-neutral-800">

      {/* Thumbnail */}
      <Link href={`/articles/${article.slug}`} className="flex-shrink-0">
        <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden
                        bg-neutral-100 dark:bg-neutral-800
                        border border-neutral-100 dark:border-neutral-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 112px, 144px"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link href={`/articles/${article.slug}`} className="group/title">
          <span className="text-[10px] font-semibold uppercase tracking-wider
                           text-[#0022FF] dark:text-[#4d6bff]">
            {article.category}
          </span>
          <h3 className="text-sm sm:text-base font-bold mt-0.5 leading-snug line-clamp-2
                         text-neutral-900 dark:text-neutral-100
                         group-hover/title:text-[#0022FF] dark:group-hover/title:text-[#4d6bff]
                         transition-colors">
            {article.title}
          </h3>
          <p className="text-xs mt-1 line-clamp-2 hidden sm:block
                        text-neutral-500 dark:text-neutral-400">
            {article.excerpt}
          </p>
        </Link>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {article.author.name}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {formatDate(article.publishedAt)}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:block">·</span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block">
            {article.readTime} mnt
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full
                         bg-neutral-100 dark:bg-neutral-800
                         text-neutral-500 dark:text-neutral-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Like / Dislike */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0 pt-1">
        <button onClick={handleLike} className="flex flex-col items-center gap-0.5">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
            ${voted === "like"
              ? "border-[#0022FF] dark:border-[#4d6bff] bg-[#0022FF]/10 dark:bg-[#4d6bff]/10"
              : "border-neutral-200 dark:border-neutral-700 hover:border-[#0022FF]/60 dark:hover:border-[#4d6bff]/60"
            }`}>
            <ThumbsUp
              size={13}
              className={voted === "like"
                ? "text-[#0022FF] dark:text-[#4d6bff]"
                : "text-neutral-400 dark:text-neutral-500"}
            />
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{likes}</span>
        </button>

        <button onClick={handleDislike} className="flex flex-col items-center gap-0.5">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
            ${voted === "dislike"
              ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/30"
              : "border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-700"
            }`}>
            <ThumbsDown
              size={13}
              className={voted === "dislike"
                ? "text-red-500 dark:text-red-400"
                : "text-neutral-400 dark:text-neutral-500"}
            />
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{dislikes}</span>
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const featured = getFeaturedArticles();
  const latest   = getNewArticles();

  const filtered = ARTICLES.filter((a) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalPages        = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedArticles = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16
                       bg-[#F9F8F5] dark:bg-neutral-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight
                           font-[family-name:var(--font-display)]
                           text-neutral-900 dark:text-neutral-100">
              Articles
            </h1>
            <p className="mt-1.5 text-sm
                          text-neutral-500 dark:text-neutral-400">
              Inspiration and information about crafting
            </p>
          </div>

          {/* ── Search ── */}
          <div className="relative max-w-lg mb-10">
            <input
              type="search"
              placeholder="Search article, category, or tag..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-11 pl-4 pr-11 rounded-full text-sm transition-colors
                         bg-white dark:bg-neutral-950
                         border border-neutral-200 dark:border-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                         focus:outline-none focus:border-[#0022FF] dark:focus:border-[#4d6bff]"
            />
            <Search
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-neutral-400 dark:text-neutral-500"
            />
          </div>

          {/* ── Top Articles & New Updates (hidden when searching) ── */}
          {!search.trim() && (
            <>
              {/* Top Articles */}
              <section className="mb-12">
                <h2 className="text-lg font-bold mb-5
                               text-neutral-900 dark:text-neutral-100">
                  Top Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {featured.map((article) => (
                    <ArticleFeaturedCard key={article.id} article={article} />
                  ))}
                </div>
              </section>

              {/* New Updates */}
              <section className="mb-12">
                <h2 className="text-lg font-bold mb-4
                               text-neutral-900 dark:text-neutral-100">
                  New Updates
                </h2>
                <div className="rounded-2xl border px-5
                                bg-white dark:bg-neutral-950
                                border-neutral-200 dark:border-neutral-800">
                  {latest.map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── All Articles / Search Results ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold
                             text-neutral-900 dark:text-neutral-100">
                {search.trim() ? `Results "${search}"` : "All Articles"}
              </h2>
              <span className="text-sm text-neutral-400 dark:text-neutral-500">
                {filtered.length} articles
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border py-16 text-center
                              bg-white dark:bg-neutral-950
                              border-neutral-200 dark:border-neutral-800">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No articles found for{" "}
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    "{search}"
                  </span>
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border px-5
                                bg-white dark:bg-neutral-950
                                border-neutral-200 dark:border-neutral-800">
                  {paginatedArticles.map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors
                                 border-neutral-200 dark:border-neutral-700
                                 text-neutral-600 dark:text-neutral-400
                                 hover:bg-neutral-100 dark:hover:bg-neutral-800
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                          ${p === page
                            ? "bg-[#0022FF] dark:bg-[#4d6bff] text-white"
                            : "border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors
                                 border-neutral-200 dark:border-neutral-700
                                 text-neutral-600 dark:text-neutral-400
                                 hover:bg-neutral-100 dark:hover:bg-neutral-800
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}