/** @format */
"use client";

import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { useEventList } from "@/services/event/hook";

export default function EventSection() {
  const { data, isLoading } = useEventList({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
    sortOrder: "asc",
  });

  const events = data?.items || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900">
              Events & Agenda
            </h2>
            <p className="text-gray-500 mt-2">
              Jadwal kegiatan dan acara mendatang
            </p>
          </div>
          <a
            href="/events"
            className="hidden md:flex items-center gap-2 text-brand-dark font-semibold hover:gap-3 transition-all"
          >
            Selengkapnya
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-40 md:h-auto bg-slate-200 shrink-0" />
                  <div className="p-6 flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada event</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image / Date Badge */}
                  <div className="w-full md:w-48 h-40 md:h-auto shrink-0">
                    {event.featuredImage ? (
                      <img
                        src={event.featuredImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-dark to-brand-dark-hover flex flex-col items-center justify-center text-white p-4">
                        <span className="text-3xl font-bold">
                          {new Date(event.eventDate).getDate()}
                        </span>
                        <span className="text-sm uppercase tracking-wider">
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-GB",
                            { month: "long", year: "numeric" }
                          )}
                        </span>
                        <span className="text-xs text-white/60 mt-1">
                          {formatTime(event.eventDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {event.tags?.length > 0 && (
                        <span className="text-xs font-semibold text-brand-dark bg-brand-dark/10 px-3 py-1 rounded-full">
                          {event.tags[0]}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarDays size={12} />
                        {formatDate(event.eventDate)}
                        {event.endDate &&
                          ` - ${formatDate(event.endDate)}`}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>

                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin size={14} className="text-slate-400" />
                        {event.location}
                      </div>
                    )}

                    {event.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {event.excerpt}
                      </p>
                    )}

                    <a
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-brand-dark font-semibold mt-3 hover:gap-2 transition-all"
                    >
                      Detail Event
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile: Selengkapnya */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/events"
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
