"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ARTICLES, getArticleBySlug } from "@/data/mockArticles";
import {
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Calendar,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article  = getArticleBySlug(slug);

  const [likes, setLikes]       = useState(article?.likes ?? 0);
  const [dislikes, setDislikes] = useState(article?.dislikes ?? 0);
  const [voted, setVoted]       = useState<"like" | "dislike" | null>(null);

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center
                         bg-[#F9F8F5] dark:bg-neutral-950">
          <div className="text-center px-6">
            <p className="text-5xl mb-4">📄</p>
            <h1 className="text-2xl font-bold mb-3
                           text-neutral-900 dark:text-neutral-100">
              Article not found
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Article maybe deleted or wrong url
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white transition-colors
                         bg-[#0022FF] hover:bg-[#0017AA]
                         dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
            >
              <ArrowLeft size={15} />
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Like / Dislike handlers ───────────────────────────────────────────────
  const handleLike = () => {
    if (voted === "like") {
      setLikes((p) => p - 1);
      setVoted(null);
    } else {
      if (voted === "dislike") setDislikes((p) => p - 1);
      setLikes((p) => p + 1);
      setVoted("like");
    }
  };

  const handleDislike = () => {
    if (voted === "dislike") {
      setDislikes((p) => p - 1);
      setVoted(null);
    } else {
      if (voted === "like") setLikes((p) => p - 1);
      setDislikes((p) => p + 1);
      setVoted("dislike");
    }
  };

  // ── Related articles ─────────────────────────────────────────────────────
  const related = ARTICLES.filter(
    (a) =>
      a.id !== article.id &&
      (a.category === article.category ||
        a.tags.some((t) => article.tags.includes(t)))
  ).slice(0, 2);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16
                       bg-[#F9F8F5] dark:bg-neutral-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

          {/* Back */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors
                       text-neutral-500 dark:text-neutral-400
                       hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft size={15} />
            Back to Articles
          </Link>

          <div className="max-w-3xl mx-auto">

            {/* ── Hero Image ── */}
            <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8
                            bg-neutral-200 dark:bg-neutral-800">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 768px"
                className="object-cover"
              />
            </div>

            {/* ── Article Header ── */}
            <div className="mb-8">
              {/* Category badge */}
              <span className="inline-block text-xs font-semibold uppercase tracking-wider
                               px-3 py-1 rounded-full mb-3
                               text-[#0022FF] dark:text-[#4d6bff]
                               bg-[#0022FF]/10 dark:bg-[#4d6bff]/20">
                {article.category}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-5
                             font-[family-name:var(--font-display)]
                             text-neutral-900 dark:text-neutral-100">
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-neutral-400 dark:text-neutral-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {article.author.name}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    · {article.author.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-neutral-400 dark:text-neutral-500" />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-neutral-400 dark:text-neutral-500" />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {article.readTime} menit baca
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-neutral-200 dark:border-neutral-800" />
            </div>

            {/* ── Content ── */}
            <div className="mb-10 space-y-5">
              {article.content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-[1.85] text-neutral-700 dark:text-neutral-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* ── Tags ── */}
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <Tag size={14} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition-colors
                             border
                             bg-neutral-100 dark:bg-neutral-800
                             border-neutral-200 dark:border-neutral-700
                             text-neutral-600 dark:text-neutral-400
                             hover:bg-[#0022FF]/10 dark:hover:bg-[#4d6bff]/20
                             hover:text-[#0022FF] dark:hover:text-[#4d6bff]
                             hover:border-[#0022FF]/30 dark:hover:border-[#4d6bff]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ── Like / Dislike ── */}
            <div className="flex items-center justify-between py-5 border-t border-b mb-12
                            border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Do you like this article?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${voted === "like"
                      ? "border-[#0022FF] dark:border-[#4d6bff] bg-[#0022FF]/10 dark:bg-[#4d6bff]/10 text-[#0022FF] dark:text-[#4d6bff]"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-[#0022FF]/50 dark:hover:border-[#4d6bff]/50 hover:text-[#0022FF] dark:hover:text-[#4d6bff]"
                    }`}
                >
                  <ThumbsUp size={15} />
                  <span>{likes}</span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                    ${voted === "dislike"
                      ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400"
                    }`}
                >
                  <ThumbsDown size={15} />
                  <span>{dislikes}</span>
                </button>
              </div>
            </div>

            {/* ── Related Articles ── */}
            {related.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-5
                               text-neutral-900 dark:text-neutral-100">
                  Related articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/articles/${rel.slug}`}
                      className="group flex gap-3 p-3 rounded-xl border transition-all
                                 bg-white dark:bg-neutral-900
                                 border-neutral-200 dark:border-neutral-800
                                 hover:border-[#0022FF] dark:hover:border-[#4d6bff]
                                 hover:shadow-sm"
                    >
                      <div className="relative w-20 h-[60px] rounded-lg overflow-hidden flex-shrink-0
                                      bg-neutral-100 dark:bg-neutral-800">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider
                                         text-[#0022FF] dark:text-[#4d6bff]">
                          {rel.category}
                        </span>
                        <h3 className="text-xs font-semibold mt-0.5 line-clamp-2 leading-snug transition-colors
                                       text-neutral-900 dark:text-neutral-100
                                       group-hover:text-[#0022FF] dark:group-hover:text-[#4d6bff]">
                          {rel.title}
                        </h3>
                        <p className="text-[11px] mt-1
                                      text-neutral-400 dark:text-neutral-500">
                          {rel.readTime} mnt baca
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}