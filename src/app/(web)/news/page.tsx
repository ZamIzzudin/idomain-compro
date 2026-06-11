/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
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

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data, isLoading } = useArticleList({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    status: "PUBLISHED",
    sortOrder: "desc",
  });

  const { data: recentData } = useArticleList({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
    sortOrder: "desc",
  });

  const recentArticles = recentData?.items || [];

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
      <section className="bg-brand-steel text-white py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4">
            News & Updates
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
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
                goToPage(1);
              }}
              className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  goToPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content + Aside */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-8 md:py-16 w-full">
        <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {isLoading ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse h-72" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse h-56"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse h-64"
                    />
                  ))}
                </div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg">
                  Tidak ada artikel ditemukan
                </p>
              </div>
            ) : (
              (() => {
                const rows: { cols: number; items: typeof articles }[] = [];
                let idx = 0;
                const pattern = [1, 3, 2];

                while (idx < articles.length) {
                  const rowLen = pattern[rows.length % pattern.length];
                  const items = articles.slice(idx, idx + rowLen);
                  rows.push({ cols: rowLen, items });
                  idx += rowLen;
                }

                return (
                  <div className="space-y-6">
                    {rows.map((row, ri) => {
                      const gridClass =
                        row.cols === 1
                          ? "grid grid-cols-1"
                          : row.cols === 2
                            ? "grid grid-cols-1 md:grid-cols-2"
                            : "grid grid-cols-1 md:grid-cols-3";

                      return (
                        <div key={ri} className={gridClass + " gap-6"}>
                          {row.items.map((article) => (
                            <Link
                              key={article.id}
                              href={`/news/${article.slug}`}
                              className="group block bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
                            >
                              {/* Gambar selalu di atas */}
                              <div
                                className={`overflow-hidden ${
                                  row.cols === 1
                                    ? "h-72"
                                    : row.cols === 2
                                      ? "h-52"
                                      : "h-44"
                                }`}
                              >
                                {article.featuredImage ? (
                                  <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-brand-dark/60 to-brand-dark-hover/60 flex items-center justify-center">
                                    <span className="text-white/40 text-sm">
                                      News
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Konten selalu di bawah */}
                              <div
                                className={`${
                                  row.cols === 1
                                    ? "p-6"
                                    : row.cols === 2
                                      ? "p-5"
                                      : "p-4"
                                }`}
                              >
                                {/* Tag + Tanggal */}
                                <div className="flex items-center gap-2 mb-2">
                                  {article.tags?.length > 0 &&
                                    article?.tags?.map((tag) => (
                                      <span className="text-[10px] font-semibold text-brand-dark bg-brand-dark/10 px-2 py-0.5 rounded-full capitalize tracking-wide">
                                        {tag}
                                      </span>
                                    ))}
                                </div>

                                {/* Judul */}
                                <h3
                                  className={`${
                                    row.cols === 1
                                      ? "text-xl md:text-2xl"
                                      : row.cols === 2
                                        ? "text-base"
                                        : "text-sm"
                                  } font-bold text-gray-900 group-hover:text-brand-dark transition-colors line-clamp-2 mb-3`}
                                >
                                  {article.title}
                                </h3>

                                {/* Author + Tanggal (seperti gambar) */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Calendar size={12} />
                                    {formatDate(
                                      article.publishedAt || article.createdAt,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>

          {/* Aside - Recent News */}
          {recentArticles.length > 0 && (
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white sticky top-8">
                <h3 className="text-base font-bold text-brand-dark mb-4">
                  What's New
                </h3>
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="flex gap-3 group border-b border-brand-steel p-3 hover:bg-brand-steel"
                    >
                      <div className="w-16 h-16 overflow-hidden shrink-0 bg-slate-100">
                        {article.featuredImage ? (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-dark/60 to-brand-dark-hover/60 flex items-center justify-center">
                            <Calendar size={14} className="text-white/60" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                          {article.title}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block group-hover:text-white">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
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
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-brand-steel text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
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
