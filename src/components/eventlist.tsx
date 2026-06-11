/** @format */
"use client";

import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
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

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-3 w-full justify-center">
            <div className="h-7 w-7 bg-brand-mint"></div>
            <h2 className="text-[28px] md:text-[52px] font-bold text-brand-steel text-center">
              Events & Programs
            </h2>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-3">
            {events.map((event) => {
              const dataEvent = formatDate(event.eventDate);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="block"
                >
                <article
                  className="overflow-hidden border-brand-steel/50 hover:bg-brand-steel group duration-300"
                >
                  <div className="flex flex-col p-4">
                    <div className="flex gap-3">
                      <div className="flex items-start flex-col px-3">
                        <span className="flex items-center w-fit gap-1 text-5xl text-brand-steel block group-hover:text-white justify-left pb-1 mb-1 font-bold">
                          {dataEvent.split(" ")[0]}
                        </span>
                        <span className="group-hover:text-white flex items-center gap-1 text-xs text-brand-steel font-semibold">
                          {dataEvent.split(" ")[1]} {dataEvent.split(" ")[2]}
                        </span>
                      </div>
                      <div className="col-span-3 flex flex-col justify-center">
                        <div className="w-full md:w-full h-40 md:h-auto shrink-0">
                          {event.featuredImage ? (
                            <img
                              src={event.featuredImage}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-dark to-brand-dark-hover flex flex-col items-center justify-center text-brand-steel p-4">
                              <span className="text-3xl font-bold">
                                {new Date(event.eventDate).getDate()}
                              </span>
                              <span className="text-sm uppercase tracking-wider">
                                {new Date(event.eventDate).toLocaleDateString(
                                  "en-GB",
                                  { month: "long", year: "numeric" },
                                )}
                              </span>
                              <span className="text-xs text-brand-steel/60 mt-1">
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
                          <h3 className="text-lg font-semibold text-brand-steel group-hover:text-white">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                </Link>
              );
            })}
          </div>
        )}
        <div className="flex items-center justify-center py-5">
          <Link
            href="/events"
            className="hidden md:flex items-center gap-2 text-brand-steel font-semibold hover:gap-3 transition-all"
          >
            Selengkapnya
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Mobile: Selengkapnya */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/events"
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
