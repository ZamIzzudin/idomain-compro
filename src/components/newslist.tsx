/** @format */
"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { useArticleList } from "@/services/article/hook";

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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900">
              News & Updates
            </h2>
            <p className="text-gray-500 mt-2">
              Berita dan informasi terbaru dari kami
            </p>
          </div>
          <a
            href="/news"
            className="hidden md:flex items-center gap-2 text-brand-dark font-semibold hover:gap-3 transition-all"
          >
            Selengkapnya
            <ArrowRight size={18} />
          </a>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="w-full h-48">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-dark/80 to-brand-dark-hover/80 flex items-center justify-center">
                      <span className="text-white/50 text-sm">News Image</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {article.tags?.length > 0 && (
                      <span className="text-xs font-semibold text-brand-dark bg-brand-dark/10 px-3 py-1 rounded-full">
                        {article.tags[0]}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-dark transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-3">
                    {article.excerpt || ""}
                  </p>

                  <a
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-brand-dark font-semibold mt-4 hover:gap-2 transition-all"
                  >
                    Read more
                    <ArrowRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile: Selengkapnya */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-brand-dark font-semibold"
          >
            Selengkapnya
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
