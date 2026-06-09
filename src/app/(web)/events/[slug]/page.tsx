/** @format */

"use client";

import { useParams } from "next/navigation";
import Container from "@/components/atomic/container";
import { CalendarDays, ArrowLeft, User, Eye, MapPin } from "lucide-react";
import { useEventBySlug } from "@/services/event/hook";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useEventBySlug(slug);
  const event = data?.data;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
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
    <Container>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto">
          <a
            href="/events"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Events
          </a>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/20 rounded w-3/4" />
              <div className="h-4 bg-white/20 rounded w-1/3" />
            </div>
          ) : event ? (
            <>
              <h1 className="text-[28px] md:text-[40px] font-bold mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {formatDate(event.eventDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </span>
                <span className="flex items-center gap-1.5">
                  {formatTime(event.eventDate)}
                  {event.endDate && ` - ${formatTime(event.endDate)}`}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {event.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {event.views} views
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-bold">Event Not Found</h1>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {event?.featuredImage && (
        <section className="px-[5%] md:px-[7%] lg:px-[10%] w-full">
          <div className="max-w-4xl mx-auto -mt-8">
            <img
              src={event.featuredImage}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-12 w-full">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/6" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          ) : event ? (
            <>
              {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-brand-dark bg-brand-dark/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Event Info Card */}
              <div className="bg-brand-dark/5 rounded-xl p-6 mb-8 border border-brand-dark/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-3 h-3 text-brand-dark mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Tanggal
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(event.eventDate)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatTime(event.eventDate)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </p>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-3 h-3 text-brand-dark mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Lokasi
                        </p>
                        <p className="text-sm font-medium text-slate-800">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-dark"
                dangerouslySetInnerHTML={{
                  __html: event.content || "<p>No content available.</p>",
                }}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Event tidak ditemukan</p>
              <a
                href="/events"
                className="inline-flex items-center gap-2 text-brand-dark font-semibold mt-4"
              >
                <ArrowLeft size={16} />
                Kembali ke Events
              </a>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
