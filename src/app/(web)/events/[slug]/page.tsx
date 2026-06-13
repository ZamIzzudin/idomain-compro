/** @format */

"use client";

import { useParams } from "next/navigation";
import Container from "@/components/atomic/container";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
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
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto">
          <a
            href="/events"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali
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
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-300">
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
              className="w-full h-48 md:h-96 object-cover rounded-2xl shadow-lg"
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
            <AnimateOnScroll>
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

              <div
                className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-dark"
                dangerouslySetInnerHTML={{
                  __html: event.content || "<p>No content available.</p>",
                }}
              />
              </>
            </AnimateOnScroll>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Event tidak ditemukan</p>
              <a
                href="/events"
                className="inline-flex items-center gap-2 text-brand-dark font-semibold mt-4"
              >
                <ArrowLeft size={16} />
                Kembali
              </a>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
