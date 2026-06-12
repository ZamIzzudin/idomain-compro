"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Container from "@/components/atomic/container";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  Award,
  MapPin,
  UserPlus,
  LogIn,
  Briefcase,
  Users,
  BarChart3,
} from "lucide-react";
import {
  useAlumniList,
  useAlumniFilterOptions,
  useAlumniStats,
} from "@/services/alumni/hook";
import type { AlumniItem } from "@/services/alumni/service";

const IndonesiaAlumniMap = dynamic(
  () => import("@/components/IndonesiaAlumniMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-slate-400 text-sm">Memuat peta...</p>
      </div>
    ),
  },
);

const PER_PAGE = 12;

export default function AlumniPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [filterSpec, setFilterSpec] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniItem | null>(null);
  const [filterProvince, setFilterProvince] = useState<string | undefined>(
    undefined,
  );

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useAlumniList({
    page,
    perPage: PER_PAGE,
    q: debouncedSearch || undefined,
    graduationYear: filterYear,
    specialization: filterSpec,
    province: filterProvince,
    sort,
  });

  const { data: filterOptions } = useAlumniFilterOptions();
  const { data: stats } = useAlumniStats();

  const alumni = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const resetFilters = () => {
    setFilterYear(undefined);
    setFilterSpec(undefined);
    setFilterProvince(undefined);
    setSort("newest");
    setPage(1);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("alumni_token"));
  }, []);

  const formatDegree = (item: AlumniItem) => {
    const parts: string[] = [];
    if (item.degreePrefix) parts.push(item.degreePrefix);
    if (item.degreeSuffix) parts.push(item.degreeSuffix);
    return parts.join(", ");
  };

  const formatWorkPeriod = (wh: {
    startYear: number;
    endYear: number | null;
  }) => {
    if (wh.endYear) return `${wh.startYear} - ${wh.endYear}`;
    return `${wh.startYear} - Sekarang`;
  };

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-steel text-white py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[32px] md:text-[48px] font-bold flex items-center justify-center gap-3">
            Alumni
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint mb-6"></div>
          {!isLoggedIn && (
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/alumni/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-steel rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Daftar Alumni
              </Link>
              <Link
                href="/alumni/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats & Map Section */}
      {stats && (
        <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="gap-5 flex flex-col">
              {/* Map */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-brand-steel" />
                  <h2 className="text-lg font-bold text-slate-800">
                    Sebaran Alumni
                  </h2>
                </div>
                <div>
                  <IndonesiaAlumniMap
                    data={stats.byProvince}
                    selectedProvince={filterProvince}
                    onProvinceClick={(province) => {
                      setFilterProvince(province || undefined);
                      setPage(1);
                      if (province) {
                        document
                          .getElementById("alumni-list")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  />
                  {filterProvince && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                      <span className="text-slate-500">Filter:</span>
                      <span className="font-medium text-brand-steel">
                        {filterProvince}
                      </span>
                      <button
                        onClick={() => {
                          setFilterProvince(undefined);
                          setPage(1);
                        }}
                        className="p-0.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4 grid grid-cols-4 gap-3">
                {/* Total Alumni */}
                <div className="bg-brand-steel rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 opacity-80" />
                    <span className="text-sm font-medium opacity-80">
                      Total Alumni
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                {/* Top Provinces */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-brand-dark" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Provinsi Terbanyak
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {stats.byProvince.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.province}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400 w-4">
                            {idx + 1}.
                          </span>
                          <span className="text-sm text-slate-700 truncate max-w-[140px]">
                            {item.province}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-brand-dark">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Specializations */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Spesialisasi Terbanyak
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {stats.bySpecialization.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.specialization}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400 w-4">
                            {idx + 1}.
                          </span>
                          <span className="text-sm text-slate-700 truncate max-w-[140px]">
                            {item.specialization}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-brand-steel">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch Bento */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-brand-steel" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Alumni per Angkatan
                    </h3>
                  </div>
                  {(() => {
                    const batchData =
                      stats.byBatch && stats.byBatch.length > 0
                        ? stats.byBatch.slice(-10)
                        : stats.byYear.slice(-10);
                    const maxCount = Math.max(
                      ...batchData.map((y: any) => y.count),
                      1,
                    );
                    const getLabel = (item: any) =>
                      "batch" in item ? item.batch : item.year;
                    const getRank = (item: any) => {
                      const ratio = item.count / maxCount;
                      if (ratio > 0.75) return 3;
                      if (ratio > 0.4) return 2;
                      if (ratio > 0.15) return 1;
                      return 0;
                    };
                    const rankSpan: Record<number, string> = {
                      3: "col-span-2 row-span-2",
                      2: "col-span-2",
                      1: "",
                      0: "",
                    };
                    const rankBg: Record<number, string> = {
                      3: "bg-brand-steel text-white",
                      2: "bg-brand-steel/15 text-brand-steel",
                      1: "bg-brand-steel/5 text-brand-steel",
                      0: "bg-slate-50 text-slate-500",
                    };
                    return (
                      <div className="grid grid-cols-4 gap-1 auto-rows-[2rem]">
                        {batchData.map((item) => {
                          const label = getLabel(item);
                          const rank = getRank(item);
                          return (
                            <div
                              key={String(label)}
                              className={`rounded-md flex items-center justify-center transition-colors hover:opacity-80 cursor-default ${rankSpan[rank]} ${rankBg[rank]}`}
                              title={`${label}: ${item.count} alumni`}
                            >
                              <span className="text-[10px] font-bold leading-none">
                                {item.count}
                              </span>
                              <span className="text-[8px] opacity-60 leading-none ml-0.5">
                                ({String(label)})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-8 w-full bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari alumni berdasarkan nama, spesialisasi, lokasi..."
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
                showFilters
                  ? "border-brand-dark bg-brand-dark/5 text-brand-dark"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {(filterYear || filterSpec || filterProvince) && (
                <span className="w-2 h-2 bg-brand-dark rounded-full" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <select
                value={filterYear ?? ""}
                onChange={(e) => {
                  setFilterYear(
                    e.target.value ? Number(e.target.value) : undefined,
                  );
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="">Semua Tahun</option>
                {filterOptions?.years?.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={filterSpec ?? ""}
                onChange={(e) => {
                  setFilterSpec(e.target.value || undefined);
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="">Semua Spesialisasi</option>
                {filterOptions?.specializations?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="newest">Terbaru</option>
                <option value="name_asc">Nama A-Z</option>
                <option value="name_desc">Nama Z-A</option>
                <option value="year_asc">Tahun (Terlama)</option>
                <option value="year_desc">Tahun (Terbaru)</option>
              </select>

              {(filterYear || filterSpec || filterProvince) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Alumni Grid */}
      <section
        id="alumni-list"
        className="px-[5%] md:px-[7%] lg:px-[10%] pb-16 w-full bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                Tidak ada alumni ditemukan
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Coba ubah kata kunci pencarian atau filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {alumni.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAlumni(item)}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group cursor-pointer"
                >
                  {/* Photo */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-brand-dark to-brand-dark-hover flex items-center justify-center">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {item.name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-800 group-hover:text-brand-dark transition-colors">
                      {item.name}
                    </h3>

                    {formatDegree(item) && (
                      <p className="text-xs text-brand-dark font-medium mt-1">
                        {formatDegree(item)}
                      </p>
                    )}

                    {item.specialization && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-slate-500">
                          {item.specialization}
                        </span>
                      </div>
                    )}

                    {(item.province || item.city) && (
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500 truncate max-w-[180px]">
                          {[item.city, item.province]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {item.workHistories && item.workHistories.length > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500 truncate max-w-[180px]">
                          {item.workHistories[0].institutionName}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 inline-flex items-center gap-1 bg-brand-dark/5 text-brand-steel text-xs font-medium px-3 py-1 rounded-full">
                      <GraduationCap className="w-3 h-3" />
                      Angkatan {item.batch || item.graduationYear}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
        </div>
      </section>

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAlumni(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-4 right-4 p-1.5 bg-brand-steel/50 rounded-lg hover:bg-brand-steel/70 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {/* Header */}
            <div className="px-6 py-8 flex">
              <div className="flex flex-col items-center justify-start w-full">
                {selectedAlumni.photo ? (
                  <img
                    src={selectedAlumni.photo}
                    alt={selectedAlumni.name}
                    className="object-cover w-24 h-24 rounded-2xl border-2 border-white/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-brand-dark/10 flex items-center justify-center">
                    <span className="text-brand-dark text-3xl font-bold">
                      {selectedAlumni.name[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="mt-3 inline-flex items-center gap-1 bg-brand-dark/5 text-brand-steel text-xs font-medium px-3 py-1 rounded-full">
                  <GraduationCap className="w-3 h-3" />
                  Angkatan{" "}
                  {selectedAlumni.batch || selectedAlumni.graduationYear}
                </div>
              </div>
            </div>
            <div className="border border-slate-100 p-5 space-y-4 flex-1 flex w-full">
              <div className="space-y-3 w-full flex flex-col justify-evenly">
                <div className="grid grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Nama Lengkap</p>
                      <p className="text-sm font-medium text-slate-700">
                        {`${selectedAlumni.degreePrefix} `}
                        {selectedAlumni.name}
                        {` ${selectedAlumni.degreeSuffix} `}
                      </p>
                    </div>
                  </div>

                  {selectedAlumni.specialization && (
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Spesialisasi</p>
                        <p className="text-sm font-medium text-slate-700">
                          {selectedAlumni.specialization}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedAlumni.province || selectedAlumni.city) && (
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Lokasi</p>
                      <p className="text-sm font-medium text-slate-700">
                        {[selectedAlumni.city, selectedAlumni.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2">
                  {selectedAlumni.email && (
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-sm font-medium text-slate-700">
                          {selectedAlumni.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedAlumni.contactNumber && (
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Kontak</p>
                        <p className="text-sm font-medium text-slate-700">
                          {selectedAlumni.contactNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work History in Modal */}
                {selectedAlumni.workHistories &&
                  selectedAlumni.workHistories.length > 0 && (
                    <div className="border-t border-slate-100 pt-3 mt-2">
                      <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Riwayat Kerja
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedAlumni.workHistories.map((wh) => (
                          <div
                            key={wh.id}
                            className="bg-slate-50 rounded-lg p-2.5"
                          >
                            <p className="text-sm font-medium text-slate-700">
                              {wh.institutionName}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-slate-500">
                                {formatWorkPeriod(wh)}
                              </span>
                              {(wh.province || wh.city) && (
                                <span className="text-xs text-slate-400 flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {[wh.city, wh.province]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
