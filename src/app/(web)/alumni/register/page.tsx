"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/atomic/container";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  X,
  Search,
  UserCheck,
  UserPlus,
  MapPin,
  Award,
} from "lucide-react";
import {
  useRegisterAlumni,
  useLookupAlumni,
  useClaimAlumni,
} from "@/services/alumni/hook";
import type { AlumniLookupItem } from "@/services/alumni/service";
import AxiosClient from "@/lib/axios";

import degreeData from "@/data/degree.json";
import specializationData from "@/data/specialization.json";
import locationData from "@/data/location.json";

const degreePrefixes = (degreeData as any[]).filter(
  (d: any) => d.type === "prefix",
);
const degreeSuffixes = (degreeData as any[]).filter(
  (d: any) => d.type === "suffix",
);
const provinces = (locationData as any).data.map((l: any) => l.provinsi);
const getProvinceCities = (prov: string) =>
  (locationData as any).data.find((l: any) => l.provinsi === prov)?.kota || [];

type Step = "lookup" | "recommend" | "form";

export default function AlumniRegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending: registerPending } = useRegisterAlumni();
  const { mutate: lookup, isPending: lookupPending } = useLookupAlumni();
  const useClaim = useClaimAlumni();

  const [step, setStep] = useState<Step>("lookup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Lookup
  const [lookupName, setLookupName] = useState("");
  const [lookupBatch, setLookupBatch] = useState("");

  // Step 2: Recommendations
  const [matches, setMatches] = useState<AlumniLookupItem[]>([]);
  const [selectedAlumniId, setSelectedAlumniId] = useState<number | null>(null);
  const [mode, setMode] = useState<"claim" | "new" | null>(null);

  // Step 3: Form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    graduationYear: "",
    batch: "",
    degreePrefix: "",
    degreePrefixCustom: "",
    degreeSuffix: "",
    degreeSuffixCustom: "",
    specialization: "",
    specializationCustom: "",
    province: "",
    provinceCustom: "",
    city: "",
    cityCustom: "",
  });

  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (form.province && form.province !== "Lainnya") {
      setCities(getProvinceCities(form.province));
    } else {
      setCities([]);
    }
  }, [form.province]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Step 1: Handle lookup
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!lookupName.trim() || !lookupBatch) {
      toast.error("Nama dan tahun masuk/angkatan wajib diisi");
      return;
    }

    lookup(
      { name: lookupName.trim(), batch: parseInt(lookupBatch) },
      {
        onSuccess: (data: AlumniLookupItem[]) => {
          setMatches(data);
          if (data.length > 0) {
            setStep("recommend");
          } else {
            // No matches, go directly to form in "new" mode
            setMode("new");
            setForm((prev) => ({
              ...prev,
              name: lookupName.trim(),
              batch: lookupBatch,
            }));
            setStep("form");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Terjadi kesalahan saat pencarian.",
          );
        },
      },
    );
  };

  // Step 2: Choose claim or new
  const handleSelectClaim = () => {
    if (!selectedAlumniId) {
      toast.error("Pilih data alumni yang sesuai");
      return;
    }
    const selected = matches.find((m) => m.id === selectedAlumniId);
    setMode("claim");
    setForm((prev) => ({
      ...prev,
      name: selected?.name || lookupName.trim(),
      batch: selected?.batch ? String(selected.batch) : lookupBatch,
      graduationYear: selected?.graduationYear
        ? String(selected.graduationYear)
        : "",
      contactNumber: selected?.contactNumber || "",
      degreePrefix: selected?.degreePrefix || "",
      degreeSuffix: selected?.degreeSuffix || "",
      specialization: selected?.specialization || "",
      province: selected?.province || "",
      city: selected?.city || "",
    }));
    if (selected?.province && selected.province !== "Lainnya") {
      setCities(getProvinceCities(selected.province));
    }
    if (selected?.photo) {
      setPhotoPreview(selected.photo);
    }
    setStep("form");
  };

  const handleSelectNew = () => {
    setMode("new");
    setForm((prev) => ({
      ...prev,
      name: lookupName.trim(),
      batch: lookupBatch,
    }));
    setStep("form");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Ukuran file melebihi batas maksimal 1 MB.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { data } = await AxiosClient.post("/upload/image", {
        image: base64,
      });
      return data.data.url;
    } catch {
      return null;
    }
  };

  // Step 3: Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.graduationYear) {
      toast.error("Email, password, dan tahun kelulusan wajib diisi");
      return;
    }
    if (!form.name) {
      toast.error("Nama wajib diisi");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
    }

    const finalDegreePrefix =
      form.degreePrefix === "Lainnya"
        ? form.degreePrefixCustom
        : form.degreePrefix;
    const finalDegreeSuffix =
      form.degreeSuffix === "Lainnya"
        ? form.degreeSuffixCustom
        : form.degreeSuffix;
    const finalSpecialization =
      form.specialization === "Lainnya"
        ? form.specializationCustom
        : form.specialization;
    const finalProvince =
      form.province === "Lainnya" ? form.provinceCustom : form.province;
    const finalCity = form.city === "Lainnya" ? form.cityCustom : form.city;

    const payload = {
      email: form.email,
      password: form.password,
      contactNumber: form.contactNumber || null,
      batch: form.batch ? parseInt(form.batch) : null,
      degreePrefix: finalDegreePrefix || null,
      degreeSuffix: finalDegreeSuffix || null,
      specialization: finalSpecialization || null,
      province: finalProvince || null,
      city: finalCity || null,
      photo: photoUrl,
    };

    if (mode === "claim" && selectedAlumniId) {
      // Claim existing alumni
      useClaim.mutate(
        { id: selectedAlumniId, ...payload },
        {
          onSuccess: (data: any) => {
            if (data.status === 200 || data.status === 201) {
              toast.success("Klaim alumni berhasil! Silakan login dengan akun Anda.");
              router.push("/alumni/login");
            } else {
              toast.error(data.message || "Gagal mengklaim data alumni");
            }
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Terjadi kesalahan. Silakan coba lagi.",
            );
          },
        },
      );
    } else {
      // Register new alumni
      register(
        {
          name: form.name,
          ...payload,
          graduationYear: parseInt(form.graduationYear),
        },
        {
          onSuccess: (data: any) => {
            if (data.status === 201) {
              toast.success("Registrasi berhasil! Silakan login dengan akun Anda.");
              router.push("/alumni/login");
            } else {
              toast.error(data.message || "Registrasi gagal");
            }
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Terjadi kesalahan. Silakan coba lagi.",
            );
          },
        },
      );
    }
  };

  const isPending = registerPending || useClaim.isPending;

  return (
    <Container>
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            Registrasi Alumni
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-steel mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
              {[
                { key: "lookup", label: "1. Cari Data", step: "lookup" },
                { key: "recommend", label: "2. Pilih", step: "recommend" },
                { key: "form", label: "3. Lengkapi", step: "form" },
              ].map((s, i) => {
                const stepOrder = ["lookup", "recommend", "form"];
                const currentIdx = stepOrder.indexOf(step);
                const thisIdx = i;
                const isActive = step === s.step;
                const isDone = thisIdx < currentIdx;
                return (
                  <div key={s.key} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                        isActive
                          ? "bg-brand-steel text-white"
                          : isDone
                            ? "bg-green-700 text-white"
                            : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-brand-steel" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                    {i < 2 && <div className="flex-1 h-px bg-slate-200 mx-1" />}
                  </div>
                );
              })}
            </div>

          {/* STEP 1: Lookup */}
          {step === "lookup" && (
            <AnimateOnScroll>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-brand-steel" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Cari Data Alumni
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Masukkan nama dan tahun masuk/angkatan untuk memeriksa apakah
                  data Anda sudah tercatat. Jika sudah ada, Anda bisa mengklaim
                  dan melengkapinya.
                </p>
              </div>

              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={lookupName}
                    onChange={(e) => {
                      setLookupName(e.target.value);
                                      }}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tahun Masuk / Angkatan *
                  </label>
                  <input
                    type="number"
                    value={lookupBatch}
                    onChange={(e) => {
                      setLookupBatch(e.target.value);
                                      }}
                    placeholder="2017"
                    min={1900}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={lookupPending}
                  className="w-full py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/70 transition-colors disabled:opacity-50"
                >
                  {lookupPending ? "Mencari..." : "Cari Data Alumni"}
                </button>
              </form>
            </div>
            </AnimateOnScroll>
          )}

          {/* STEP 2: Recommend */}
          {step === "recommend" && (
            <AnimateOnScroll>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                Data Ditemukan
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Ditemukan <strong>{matches.length}</strong> data alumni dengan
                nama dan angkatan yang sesuai. Pilih data yang merupakan milik
                Anda, atau buat data baru jika tidak ada yang cocok.
              </p>

              <div className="space-y-3 mb-6">
                {matches.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedAlumniId === m.id
                        ? "border-brand-steel bg-brand-steel/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="alumni-match"
                      value={m.id}
                      checked={selectedAlumniId === m.id}
                      onChange={() => {
                        setSelectedAlumniId(m.id);
                                          }}
                      className="mt-1 accent-brand-steel"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{m.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                        <span>Tahun Lulus: {m.graduationYear}</span>
                        {m.batch && <span>• Angkatan: {m.batch}</span>}
                        {m.degreePrefix && <span>• {m.degreePrefix}</span>}
                        {m.degreeSuffix && <span>{m.degreeSuffix}</span>}
                        {m.specialization && (
                          <span className="flex items-center gap-0.5">
                            <Award className="w-3 h-3" />
                            {m.specialization}
                          </span>
                        )}
                        {(m.province || m.city) && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {[m.city, m.province].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSelectClaim}
                  disabled={!selectedAlumniId}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/70 transition-colors disabled:opacity-40"
                >
                  <UserCheck className="w-4 h-4" />
                  Klaim Data Ini
                </button>
                <button
                  onClick={handleSelectNew}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Buat Data Baru
                </button>
              </div>

              <button
                onClick={() => {
                  setStep("lookup");
                  setMatches([]);
                  setSelectedAlumniId(null);
                              }}
                className="w-full mt-5 flex items-center justify-center gap-1  text-sm text-slate-500 hover:text-brand-steel transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
            </div>
            </AnimateOnScroll>
          )}

          {/* STEP 3: Form */}
          {step === "form" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5"
            >
              {/* Mode indicator */}
              <div
                className={`rounded-xl p-3 text-sm flex items-center gap-2 ${
                  mode === "claim"
                    ? "bg-brand-mint/50 border border-brand-steel text-brand-steel"
                    : "bg-brand-mint/50 border border-brand-steel text-brand-steel"
                }`}
              >
                {mode === "claim" ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Melengkapi data alumni yang sudah terdaftar
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Membuat data alumni baru
                  </>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Foto (opsional)
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview("");
                          setPhotoFile(null);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-brand-dark hover:bg-slate-50 transition-colors">
                      <Upload className="w-4 h-4 text-slate-300" />
                      <span className="text-[9px] text-slate-400 mt-0.5">
                        Upload
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-xs text-slate-400">
                    Format: JPG, PNG, WebP, GIF
                    <br />
                    Maks: 1 MB
                  </p>
                </div>
              </div>

              {/* Name + Degree */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gelar Depan
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="w-full sm:w-40 shrink-0">
                    <select
                      value={form.degreePrefix}
                      onChange={(e) =>
                        updateField("degreePrefix", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    >
                      <option value="">-- Pilih --</option>
                      {degreePrefixes.map((d: any) => (
                        <option key={d.label} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {form.degreePrefix === "Lainnya" && (
                      <input
                        type="text"
                        value={form.degreePrefixCustom}
                        onChange={(e) =>
                          updateField("degreePrefixCustom", e.target.value)
                        }
                        placeholder="Gelar depan"
                        className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                  </div>
                  <div className="w-full sm:w-40 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Gelar Belakang
                    </label>
                    <select
                      value={form.degreeSuffix}
                      onChange={(e) =>
                        updateField("degreeSuffix", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    >
                      <option value="">-- Pilih --</option>
                      {degreeSuffixes.map((d: any) => (
                        <option key={d.label} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {form.degreeSuffix === "Lainnya" && (
                      <input
                        type="text"
                        value={form.degreeSuffixCustom}
                        onChange={(e) =>
                          updateField("degreeSuffixCustom", e.target.value)
                        }
                        placeholder="Gelar belakang"
                        className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Spesialisasi
                </label>
                <select
                  value={form.specialization}
                  onChange={(e) =>
                    updateField("specialization", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                >
                  <option value="">-- Pilih Spesialisasi --</option>
                  {specializationData.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya (input manual)</option>
                </select>
                {form.specialization === "Lainnya" && (
                  <input
                    type="text"
                    value={form.specializationCustom}
                    onChange={(e) =>
                      updateField("specializationCustom", e.target.value)
                    }
                    placeholder="Masukkan spesialisasi"
                    className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                )}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nomor Kontak
                  </label>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) =>
                      updateField("contactNumber", e.target.value)
                    }
                    placeholder="+62 812-3456-7890"
                    maxLength={14}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>
              </div>

              {/* Years */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tahun Kelulusan *
                  </label>
                  <input
                    type="number"
                    value={form.graduationYear}
                    onChange={(e) =>
                      updateField("graduationYear", e.target.value)
                    }
                    placeholder="2020"
                    min={1900}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tahun Masuk *
                  </label>
                  <input
                    type="number"
                    value={form.batch}
                    onChange={(e) => updateField("batch", e.target.value)}
                    placeholder="2017"
                    min={1900}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Provinsi
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => {
                      updateField("province", e.target.value);
                      updateField("city", "");
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((p: string) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya (input manual)</option>
                  </select>
                  {form.province === "Lainnya" && (
                    <input
                      type="text"
                      value={form.provinceCustom}
                      onChange={(e) =>
                        updateField("provinceCustom", e.target.value)
                      }
                      placeholder="Masukkan provinsi"
                      className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kota / Kabupaten
                  </label>
                  {form.province &&
                  form.province !== "Lainnya" &&
                  cities.length > 0 ? (
                    <>
                      <select
                        disabled={!form.province}
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      >
                        <option value="">-- Pilih Kota/Kab --</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="Lainnya">Lainnya (input manual)</option>
                      </select>
                      {form.city === "Lainnya" && (
                        <input
                          disabled={!form.province}
                          type="text"
                          value={form.cityCustom}
                          onChange={(e) =>
                            updateField("cityCustom", e.target.value)
                          }
                          placeholder="Masukkan kota/kabupaten"
                          className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                        />
                      )}
                    </>
                  ) : (
                    <input
                      disabled={!form.province}
                      type="text"
                      value={form.cityCustom}
                      onChange={(e) =>
                        updateField("cityCustom", e.target.value)
                      }
                      placeholder="Masukkan kota/kabupaten"
                      className="w-full cursor-not-allowed px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent bg-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Konfirmasi Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      placeholder="Ulangi password"
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-brand-mint/50 border border-brand-steel rounded-xl p-4 text-sm text-brand-steel">
                <p className="font-medium">Perhatian:</p>
                <p>
                  {mode === "claim"
                    ? "Data yang Anda klaim akan ditinjau oleh admin. Setelah disetujui, profil Anda akan tampil di halaman alumni."
                    : "Anda dapat login segera setelah registrasi. Namun data Anda akan tampil di halaman alumni setelah disetujui oleh admin."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(matches.length > 0 ? "recommend" : "lookup");
                                  }}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium flex gap-2 items-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/70 transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Menyimpan..."
                    : mode === "claim"
                      ? "Klaim & Simpan Data"
                      : "Daftar Alumni"}
                </button>
              </div>

              <p className="text-center text-sm text-slate-500">
                Sudah punya akun?{" "}
                <Link
                  href="/alumni/login"
                  className="text-brand-steel font-medium hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </Container>
  );
}
