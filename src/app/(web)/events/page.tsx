/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/atomic/container";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useEventList, useEventFilterOptions } from "@/services/event/hook";

const PER_PAGE = 6;

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterUpcoming, setFilterUpcoming] = useState<string | undefined>(
    undefined,
  );

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data, isLoading } = useEventList({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    status: "PUBLISHED",
    upcoming: filterUpcoming,
    sortOrder: "asc",
  });

  const { data: recentData } = useEventList({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
    sortOrder: "desc",
  });

  const recentEvents = recentData?.items || [];

  const { data: filterOptions } = useEventFilterOptions();

  const events = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(data);

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-steel text-white py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4 flex items-center justify-center gap-3">
            Events & Programs
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-8 w-full bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari event berdasarkan judul, lokasi..."
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
            <button
              onClick={() => {
                setFilterUpcoming(filterUpcoming ? undefined : "true");
                goToPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
                filterUpcoming
                  ? "border-brand-dark bg-brand-dark/5 text-brand-dark"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Upcoming</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content + Aside */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] pb-16 w-full bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse h-72" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse h-56"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse h-64"
                    />
                  ))}
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  Tidak ada event ditemukan
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Coba ubah kata kunci pencarian atau filter
                </p>
              </div>
            ) : (
              (() => {
                const pattern = [1, 3, 2];
                const rows: { cols: number; items: typeof events }[] = [];
                let idx = 0;

                while (idx < events.length) {
                  const rowLen = pattern[rows.length % pattern.length];
                  const items = events.slice(idx, idx + rowLen);
                  rows.push({ cols: rowLen, items });
                  idx += rowLen;
                }

                return (
                  <div className="space-y-3">
                    {rows.map((row, ri) => {
                      const isSingle = row.cols === 1;
                      const gridClass =
                        row.cols === 1
                          ? "grid grid-cols-1"
                          : row.cols === 2
                            ? "grid grid-cols-1 md:grid-cols-2"
                            : "grid grid-cols-1 md:grid-cols-3";

                      return (
                        <div key={ri} className={`${gridClass} gap-3`}>
                          {row.items.map((event) => {
                            const d = formatDate(event.eventDate);
                            const day = d.split(" ")[0];
                            const monthYear = d.split(" ").slice(1).join(" ");

                            return (
                              <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className="overflow-hidden hover:bg-brand-steel group duration-300 block"
                              >
                                <div
                                  className={`flex ${isSingle ? "flex-col md:flex-row" : ""} p-4`}
                                >
                                  <div
                                    className={`flex items-start flex-col ${isSingle ? "px-3 md:px-5 md:justify-start md:min-w-[100px]" : "px-3"}`}
                                  >
                                    <span
                                      className={`${isSingle ? "text-8xl" : "text-5xl"} text-brand-steel block group-hover:text-white font-bold leading-none pb-1 mb-1`}
                                    >
                                      {day}
                                    </span>
                                    <span
                                      className={`group-hover:text-white text-brand-steel font-semibold ${isSingle ? "text-xl" : "text-sm"} text-center w-full`}
                                    >
                                      {monthYear}
                                    </span>
                                  </div>

                                  <div
                                    className={`flex-1 flex flex-col ${isSingle ? "" : "min-w-0"}`}
                                  >
                                    <div
                                      className={`${isSingle ? "md:w-full h-56 md:h-72" : "h-40"} w-full shrink-0 overflow-hidden rounded-lg`}
                                    >
                                      {event.featuredImage ? (
                                        <img
                                          src={event.featuredImage}
                                          alt={event.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-brand-dark to-brand-dark-hover flex flex-col items-center justify-center p-4">
                                          <span className="text-3xl font-bold text-white/70">
                                            {new Date(
                                              event.eventDate,
                                            ).getDate()}
                                          </span>
                                          <span className="text-sm uppercase tracking-wider text-white/50">
                                            {new Date(
                                              event.eventDate,
                                            ).toLocaleDateString("en-GB", {
                                              month: "long",
                                              year: "numeric",
                                            })}
                                          </span>
                                          <span className="text-xs text-white/40 mt-1">
                                            {formatTime(event.eventDate)}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="pt-3 space-y-1">
                                      {event.location && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-white">
                                          <MapPin
                                            size={14}
                                            className="text-slate-400 group-hover:text-white"
                                          />
                                          {event.location}
                                        </div>
                                      )}
                                      <h3
                                        className={`${isSingle ? "text-xl" : "text-lg"} font-semibold text-brand-steel group-hover:text-white line-clamp-2`}
                                      >
                                        {event.title}
                                      </h3>
                                      {isSingle && event.excerpt && (
                                        <p className="text-sm text-gray-500 group-hover:text-white/70 line-clamp-2">
                                          {event.excerpt}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}

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
          </div>
        </div>
      </section>
    </Container>
  );
}
