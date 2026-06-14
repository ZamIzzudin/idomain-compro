"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/atomic/container";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useCareerBySlug } from "@/services/career/hook";

export default function CareerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useCareerBySlug(slug);
  const career = data?.data;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const requirements = career?.requirements
    ?.split("\n")
    .filter((r) => r.trim())
    .map((r) => r.replace(/^[-•*]\s*/, "").trim());

  const description = career?.description
    ?.split("\n")
    .filter((d) => d.trim())
    .map((d) => d.replace(/^[-•*]\s*/, "").trim());

  const applyUrl = career?.recruitmentUrl
    ? career.recruitmentUrl
    : career?.recruitmentEmail
      ? `mailto:${career.recruitmentEmail}?subject=Lamaran: ${encodeURIComponent(career.position)}`
      : null;

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Lowongan
          </Link>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/20 rounded w-3/4" />
              <div className="h-4 bg-white/20 rounded w-1/3" />
            </div>
          ) : career ? (
            <>
              <div className="flex items-start gap-4">
                {career.logo ? (
                  <img
                    src={career.logo}
                    alt={career.institutionName}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 bg-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-8 h-8 md:w-10 md:h-10 text-white/60" />
                  </div>
                )}
                <div>
                  <p className="text-gray-300 text-sm">
                    {career.institutionName}
                  </p>
                  <h1 className="text-[24px] md:text-[36px] font-bold leading-tight">
                    {career.position}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
                {(career.province || career.city) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {[career.city, career.province].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {career.jobType}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-white/10 text-xs">
                  {career.category?.name}
                </span>
                {career.status === "CLOSED" && (
                  <span className="px-3 py-0.5 rounded-full bg-red-500/20 text-red-200 text-xs font-semibold">
                    Closed
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-full" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
            </div>
          ) : career ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Main content */}
              <div className="space-y-8">
                {/* Description */}
                {description && description.length > 0 && (
                  <AnimateOnScroll>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-3">
                        Deskripsi Pekerjaan
                      </h2>
                      <ul className="space-y-2">
                        {description.map((desc, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-steel shrink-0" />
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AnimateOnScroll>
                )}

                {/* Requirements */}
                {requirements && requirements.length > 0 && (
                  <AnimateOnScroll>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-3">
                        Persyaratan
                      </h2>
                      <ul className="space-y-2">
                        {requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-steel shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Apply card */}
                {applyUrl && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                      Lamar Sekarang
                    </h3>
                    {career.status === "CLOSED" ? (
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-200 text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
                        Pendaftaran Ditutup
                      </div>
                    ) : (
                      <a
                        href={applyUrl}
                        target={career.recruitmentUrl ? "_blank" : undefined}
                        rel={
                          career.recruitmentUrl
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/80 transition-colors text-sm"
                      >
                        {career.recruitmentUrl
                          ? "Daftar di Website"
                          : "Kirim Lamaran"}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {career.recruitmentEmail && (
                      <a
                        href={`mailto:${career.recruitmentEmail}`}
                        className="flex items-center gap-2 mt-3 text-sm text-slate-500 hover:text-brand-steel transition-colors"
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {career.recruitmentEmail}
                        </span>
                      </a>
                    )}

                    {career.contactPerson && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        <Phone className="w-4 h-4 shrink-0" />
                        {career.contactPerson}
                        {career.contactPhone && ` (${career.contactPhone})`}
                      </p>
                    )}

                    {career.deadline && (
                      <p className="flex items-center gap-2 mt-3 text-xs text-amber-600 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Batas: {formatDate(career.deadline)}
                      </p>
                    )}
                  </div>
                )}

                {/* Poster info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">
                    Diposting oleh
                  </h3>
                  <div className="flex items-center gap-3">
                    {career.author?.photo ? (
                      <img
                        src={career.author.photo}
                        alt={career.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-mint/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-brand-steel">
                          {career.author?.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {career.author?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(career.publishedAt || career.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Lowongan tidak ditemukan</p>
              <Link
                href="/career"
                className="text-brand-steel hover:underline text-sm mt-2 inline-block"
              >
                Kembali ke daftar lowongan
              </Link>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
