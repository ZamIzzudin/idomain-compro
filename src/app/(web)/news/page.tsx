/** @format */

"use client";

import { useState } from "react";
import Container from "@/components/atomic/container";
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useArticleList } from "@/services/article/hook";

const PER_PAGE = 6;

export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArticleList({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    status: "PUBLISHED",
    sortOrder: "desc",
  });

  const articles = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4">
            News & Updates
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Berita dan informasi terbaru
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] pt-8 w-full">
        <div className="max-w-full mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-8 md:py-16 w-full">
        <div className="max-w-full mx-auto space-y-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto bg-slate-200 shrink-0" />
                  <div className="p-6 flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                Tidak ada artikel ditemukan
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-dark/80 to-brand-dark-hover/80 flex items-center justify-center">
                        <span className="text-white/50 text-sm">
                          News Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
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
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {article.excerpt || ""}
                    </p>
                    <a
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-brand-dark font-semibold hover:gap-2 transition-all"
                    >
                      Read more
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-brand-dark text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </Container>
  );
}
