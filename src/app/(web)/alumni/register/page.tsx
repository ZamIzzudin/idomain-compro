"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/atomic/container";
import { GraduationCap, Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import { useRegisterAlumni } from "@/services/alumni/hook";
import AxiosClient from "@/lib/axios";

export default function AlumniRegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterAlumni();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    graduationYear: "",
    degree: "",
    specialization: "",
    institution: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diizinkan");
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
      const { data } = await AxiosClient.post("/upload/image", { image: base64 });
      return data.data.url;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.graduationYear) {
      setError("Nama, email, password, dan tahun kelulusan wajib diisi");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
    }

    register(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        contactNumber: form.contactNumber || null,
        graduationYear: parseInt(form.graduationYear),
        degree: form.degree || null,
        specialization: form.specialization || null,
        institution: form.institution || null,
        photo: photoUrl,
      },
      {
        onSuccess: (data: any) => {
          if (data.status === 201) {
            setSuccess(
              data.data?.message ||
                "Registrasi berhasil! Akun Anda menunggu persetujuan admin."
            );
            setForm({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              contactNumber: "",
              graduationYear: "",
              degree: "",
              specialization: "",
              institution: "",
            });
            setPhotoPreview("");
            setPhotoFile(null);
          } else {
            setError(data.message || "Registrasi gagal");
          }
        },
        onError: (error: any) => {
          setError(
            error?.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
          );
        },
      }
    );
  };

  return (
    <Container>
      <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10" />
            Registrasi Alumni
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Daftarkan diri Anda sebagai alumni IDOMAIN
          </p>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-lg mx-auto">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-dark mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke daftar alumni
          </Link>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm">
              <p className="font-medium mb-1">Registrasi Berhasil!</p>
              <p>{success}</p>
              <Link
                href="/alumni/login"
                className="inline-block mt-2 text-green-800 font-medium hover:underline"
              >
                Login ke akun alumni
              </Link>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5"
          >
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
                    <span className="text-[9px] text-slate-400 mt-0.5">Upload</span>
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
                  Format: JPG, PNG, WebP<br />
                  Maks: 5MB
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Dr. John Doe"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

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
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nomor Kontak
                </label>
                <input
                  type="text"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tahun Kelulusan *
                </label>
                <input
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => updateField("graduationYear", e.target.value)}
                  placeholder="2020"
                  min={1900}
                  max={2100}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gelar / Degree
              </label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => updateField("degree", e.target.value)}
                placeholder="S1, Sp.PD, etc."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Spesialisasi
              </label>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => updateField("specialization", e.target.value)}
                placeholder="Cardiology, Neurology, etc."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instansi / Institusi
              </label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="RSUD, nama rumah sakit, klinik"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              <p className="font-medium">Perhatian:</p>
              <p>
                Anda dapat login segera setelah registrasi. Namun data Anda akan
                tampil di halaman alumni setelah disetujui oleh admin.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-brand-dark text-white rounded-xl font-medium hover:bg-brand-dark-hover transition-colors disabled:opacity-50"
            >
              {isPending ? "Mendaftar..." : "Daftar Alumni"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link
                href="/alumni/login"
                className="text-brand-dark font-medium hover:underline"
              >
                Login di sini
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Container>
  );
}
