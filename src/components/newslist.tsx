/** @format */
"use client";

import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useArticleList } from "@/services/article/hook";
import AnimateOnScroll from "./atomic/animate-on-scroll";

export default function NewsSection() {
  const { data, isLoading } = useArticleList({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
    sortOrder: "desc",
  });

  const articles = data?.items || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimateOnScroll>
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex gap-3">
                <h2 className="text-[28px] md:text-[52px] font-bold text-brand-steel">
                  News & Updates
                </h2>
                <div className="h-5 w-5 bg-brand-mint"></div>
              </div>
              <p className="text-brand-steel mt-2">
                Berita dan informasi terbaru dari kami
              </p>
            </div>
            <Link
              href="/news"
              className="hidden md:flex items-center gap-2 text-brand-steel font-semibold hover:gap-3 transition-all"
            >
              Selengkapnya
              <ArrowRight size={18} />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-48 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500">Belum ada artikel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {articles.map((article, i) => (
              <AnimateOnScroll key={article.id} delay={i * 0.1}>
                <Link
                  href={`/news/${article.slug}`}
                  className="block"
                >
              <article
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group duration-300"
              >
                {/* Image */}
                <div className="w-full h-48 relative">
                  {article.featuredImage ? (
                    <>
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 z-10 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 text-brand-steel bg-brand-mint/70 duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-dark/80 to-brand-dark-hover/80 flex items-center justify-center">
                      <span className="text-white/50 text-sm">News Image</span>
                    </div>
                  )}
                </div>

                <div className="p-6 group-hover:bg-brand-steel duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white">
                      <Calendar size={12} />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>

                  <div className=" space-x-2 my-3">
                    {article.tags?.length > 0 &&
                      article?.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-brand-dark bg-brand-dark/10 group-hover:bg-brand-mint px-3 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-white transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 group-hover:text-white line-clamp-3">
                    {article.excerpt || ""}
                  </p>
                </div>
              </article>
              </Link>
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* Mobile: Selengkapnya */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-brand-dark font-semibold"
          >
            Selengkapnya
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
