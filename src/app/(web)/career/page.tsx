"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/atomic/container";
import { BreadcrumbJsonLd } from "@/components/atomic/json-ld";
import {
  Search,
  X,
  Briefcase,
  Building2,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
} from "lucide-react";
import {
  useCareerList,
  useCareerFilterOptions,
  useCategoryList,
} from "@/services/career/hook";
import { useMyProfile } from "@/services/alumni/hook";
import { Plus } from "lucide-react";

const PER_PAGE = 10;

const jobTypeColors: Record<string, string> = {
  "Penuh Waktu": "border-emerald-400 text-emerald-600",
  "Paruh Waktu": "border-emerald-400 text-emerald-600",
  Kontrak: "border-emerald-400 text-emerald-600",
  Magang: "border-emerald-400 text-emerald-600",
  Lepas: "border-emerald-400 text-emerald-600",
};

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    undefined,
  );
  const [selectedJobType, setSelectedJobType] = useState<string | undefined>(
    undefined,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string | null>(
    null,
  );

  const { data, isLoading } = useCareerList({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    status: "PUBLISHED,CLOSED",
    category: selectedCategory,
    jobType: selectedJobType,
    province: selectedProvince,
    sortOrder: "desc",
  });

  const { data: filterOptions } = useCareerFilterOptions();
  const { data: categories } = useCategoryList();
  const { data: myProfile } = useMyProfile();

  const careers = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const selectedCareer = selectedCareerSlug
    ? careers.find((c) => c.slug === selectedCareerSlug)
    : careers[0] || null;

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setSelectedProvince(undefined);
    setSelectedJobType(undefined);
    setPage(1);
  };

  const hasFilters = selectedCategory || selectedProvince || selectedJobType;

  return (
    <Container>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Beranda", path: "/" },
          { name: "Career", path: "/career" },
        ]}
      />
      {/* Hero */}
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            Career
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint mx-auto mb-4" />
          {myProfile && (
            <Link
              href="/career/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Posting Lowongan
            </Link>
          )}
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-white">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 mb-6 sticky top-2 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari posisi, institusi, atau kata kunci..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${showFilters ? "border-brand-steel bg-brand-mint/20 text-brand-steel" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {hasFilters && (
                <span className="w-2 h-2 bg-brand-steel rounded-full" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <select
                value={selectedCategory ?? ""}
                onChange={(e) => {
                  setSelectedCategory(e.target.value || undefined);
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
              >
                <option value="">Semua Kategori</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedProvince ?? ""}
                onChange={(e) => {
                  setSelectedProvince(e.target.value || undefined);
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
              >
                <option value="">Semua Provinsi</option>
                {filterOptions?.provinces?.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={selectedJobType ?? ""}
                onChange={(e) => {
                  setSelectedJobType(e.target.value || undefined);
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
              >
                <option value="">Semua Jenis</option>
                {filterOptions?.jobTypes?.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl" />
              ))}
            </div>
            <div className="animate-pulse h-96 bg-slate-100 rounded-2xl" />
          </div>
        ) : careers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              Belum ada lowongan yang tersedia
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            {/* Left: Job List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{total} Lowongan</p>
              </div>
              {careers.map((career) => {
                const isActive = selectedCareer?.slug === career.slug;
                return (
                  <button
                    key={career.id}
                    onClick={() => setSelectedCareerSlug(career.slug)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      isActive
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                        {career.position}
                      </h3>
                      <span
                        className={`inline-flex shrink-0 items-center text-xs font-medium px-2 py-0.5 rounded-full border ${jobTypeColors[career.jobType] || "border-slate-300 text-slate-600"}`}
                      >
                        {career.jobType}
                      </span>
                    </div>
                    {career.status === "CLOSED" && (
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 mt-1">
                        Closed
                      </span>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {career.institutionName}
                        </span>
                      </p>
                      {(career.province || career.city) && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {[career.city, career.province]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => {
                      setPage(Math.max(1, page - 1));
                      setSelectedCareerSlug(null);
                    }}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pn: number;
                    if (totalPages <= 5) pn = i + 1;
                    else if (page <= 3) pn = i + 1;
                    else if (page >= totalPages - 2) pn = totalPages - 4 + i;
                    else pn = page - 2 + i;
                    return (
                      <button
                        key={pn}
                        onClick={() => {
                          setPage(pn);
                          setSelectedCareerSlug(null);
                        }}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pn ? "bg-brand-steel text-white" : "hover:bg-slate-100 text-slate-600"}`}
                      >
                        {pn}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setPage(Math.min(totalPages, page + 1));
                      setSelectedCareerSlug(null);
                    }}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Detail Panel */}
            {selectedCareer && <CareerDetailPanel career={selectedCareer} isLoggedIn={!!myProfile} />}
          </div>
        )}
      </section>
    </Container>
  );
}

function CareerDetailPanel({
  career,
  isLoggedIn,
}: {
  career: {
    id: number;
    title: string;
    slug: string;
    institutionName: string;
    logo: string | null;
    position: string;
    province: string | null;
    city: string | null;
    jobType: string;
    description: string | null;
    requirements: string | null;
    deadline: string | null;
    recruitmentEmail: string | null;
    recruitmentUrl: string | null;
    contactPerson: string | null;
    contactPhone: string | null;
    status: string;
    category: { id: number; name: string; slug: string; type: string };
    author: { id: number; name: string; photo: string | null };
  };
  isLoggedIn: boolean;
}) {
  const requirements = career.requirements
    ?.split("\n")
    .filter((r) => r.trim())
    .map((r) => r.replace(/^[-•*]\s*/, "").trim());

  const description = career.description
    ?.split("\n")
    .filter((d) => d.trim())
    .map((d) => d.replace(/^[-•*]\s*/, "").trim());

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 h-fit">
      {/* Header: Logo + Institusi + Posisi + Badge */}
      <div className="flex items-start gap-4">
        {career.logo ? (
          <img
            src={career.logo}
            alt={career.institutionName}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-brand-mint/30 flex items-center justify-center shrink-0">
            <Building2 className="w-8 h-8 text-brand-steel" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 shrink-0" />
            {career.institutionName}
          </p>
          <div className="flex items-start justify-between gap-2 mt-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {career.position}
            </h2>
            <span
              className={`inline-flex shrink-0 items-center text-sm font-medium px-3 py-1 rounded-full border ${jobTypeColors[career.jobType] || "border-emerald-400 text-emerald-600"}`}
            >
              {career.jobType}
            </span>
          </div>
          {/* Category badge */}
          <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            {career.category?.name}
          </span>
          {career.status === "CLOSED" && (
            <span className="inline-flex items-center mt-2 ml-2 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
              Lowongan Ditutup
            </span>
          )}
        </div>
      </div>

      {/* Meta info - vertikal */}
      <div className="mt-4 space-y-2 text-sm text-slate-500">
        {(career.province || career.city) && (
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            {[career.city, career.province].filter(Boolean).join(", ")}
          </p>
        )}
        <p className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
          {career.jobType}
        </p>
      </div>

      {/* Apply Now Section */}
      {(career.recruitmentUrl ||
        career.recruitmentEmail ||
        career.contactPerson) && (
        <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col items-start">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Apply Now
          </h3>

          {/* Deadline badge di Apply section */}
          {career.deadline && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Batas Lamaran: {formatDate(career.deadline)}
            </span>
          )}

          {isLoggedIn ? (
            <>
              {/* Link pendaftaran sebagai button utama */}
              {career.recruitmentUrl &&
                (career.status === "CLOSED" ? (
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-400 rounded-xl font-medium text-sm mb-4 cursor-not-allowed">
                    Pendaftaran Ditutup
                  </span>
                ) : (
                  <a
                    href={career.recruitmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/80 transition-colors text-sm mb-4"
                  >
                    Daftar via Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}

              {/* Contact Person (Nomor Telepon) - dengan Phone icon */}
              {career.contactPerson && (
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  {career.contactPerson}
                  {career.contactPhone && ` (${career.contactPhone})`}
                </p>
              )}

              {/* Email rekrutmen - clickable mailto, ditebalkan */}
              {career.recruitmentEmail && (
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${career.recruitmentEmail}`}
                    className="font-bold text-brand-steel hover:underline"
                  >
                    {career.recruitmentEmail}
                  </a>
                </p>
              )}
            </>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500">
              <Link
                href="/alumni/login"
                className="font-semibold text-brand-steel hover:underline"
              >
                Login
              </Link>{" "}
              untuk melihat informasi pendaftaran.
            </div>
          )}
        </div>
      )}

      {/* Job Description Section */}
      {(requirements || description) && (
        <div className="border-t border-slate-100 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Job Description
          </h3>

          {requirements && requirements.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Job Requirement
              </p>
              <ul className="space-y-2">
                {requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {description && description.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Job Description
              </p>
              <ul className="space-y-2">
                {description.map((desc, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* View full detail link */}
      <div className="border-t border-slate-100 pt-4 mt-6">
        <Link
          href={`/career/${career.slug}`}
          className="text-sm text-brand-steel hover:underline font-medium"
        >
          Lihat halaman lengkap
        </Link>
      </div>
    </div>
  );
}
