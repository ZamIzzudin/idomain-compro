/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/atomic/container";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Upload,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useMyProfile, useUpdateMyProfile } from "@/services/alumni/hook";
import AxiosClient from "@/lib/axios";

export default function AlumniProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("alumni_token")) {
      router.push("/alumni/login");
    }
  }, []);

  const { data: alumni, isLoading } = useMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    graduationYear: "",
    degree: "",
    specialization: "",
    institution: "",
    password: "",
    confirmPassword: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (alumni) {
      setForm({
        name: alumni.name || "",
        email: alumni.email || "",
        contactNumber: alumni.contactNumber || "",
        graduationYear: alumni.graduationYear?.toString() || "",
        degree: alumni.degree || "",
        specialization: alumni.specialization || "",
        institution: alumni.institution || "",
        password: "",
        confirmPassword: "",
      });
      setPhotoPreview(alumni.photo || "");
    }
  }, [alumni]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran foto maksimal 5MB" });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
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

  const handleSave = async () => {
    setMessage(null);

    if (!form.name) {
      setMessage({ type: "error", text: "Nama wajib diisi" });
      return;
    }

    if (form.password && form.password.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" });
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }

    const payload: any = {
      name: form.name,
      email: form.email || null,
      contactNumber: form.contactNumber || null,
      graduationYear: parseInt(form.graduationYear) || undefined,
      degree: form.degree || null,
      specialization: form.specialization || null,
      institution: form.institution || null,
    };

    if (form.password) {
      payload.password = form.password;
    }

    if (photoFile) {
      const url = await uploadPhoto(photoFile);
      if (url) payload.photo = url;
    } else if (removePhoto) {
      payload.removePhoto = true;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setMessage({ type: "success", text: "Profil berhasil diperbarui" });
        setEditing(false);
        setPhotoFile(null);
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      },
      onError: (error: any) => {
        setMessage({
          type: "error",
          text: error?.response?.data?.message || "Gagal memperbarui profil",
        });
      },
    });
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <Container>
        <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse h-10 bg-white/20 rounded w-64 mx-auto mb-3" />
          </div>
        </section>
        <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
          <div className="max-w-lg mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10" />
            Profil Saya
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Kelola data profil alumni Anda
          </p>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-dark mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke beranda
          </Link>

          {/* Approval status */}
          {alumni && !alumni.isApproved && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 mb-6 text-sm">
              <p className="font-medium">Akun belum disetujui</p>
              <p>
                Data Anda belum tampil di halaman alumni. Menunggu persetujuan admin.
              </p>
            </div>
          )}

          {message && (
            <div
              className={`rounded-xl p-4 mb-6 text-sm ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5">
            {/* Photo */}
            <div className="flex flex-col items-center">
              {editing ? (
                <div className="relative">
                  {photoPreview ? (
                    <>
                      <img
                        src={photoPreview}
                        alt="Photo"
                        className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview("");
                          setPhotoFile(null);
                          setRemovePhoto(true);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-brand-dark hover:bg-slate-50 transition-colors">
                      <Upload className="w-5 h-5 text-slate-300" />
                      <span className="text-[10px] text-slate-400 mt-0.5">Upload</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ) : (
                <>
                  {alumni?.photo ? (
                    <img
                      src={alumni.photo}
                      alt={alumni.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-brand-dark/10 flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-brand-dark/40" />
                    </div>
                  )}
                </>
              )}
              <p className="text-sm font-semibold text-gray-800 mt-3">
                {alumni?.name}
              </p>
              <p className="text-xs text-gray-500">{alumni?.email}</p>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                />
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
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tahun Kelulusan
                  </label>
                  <input
                    type="number"
                    value={form.graduationYear}
                    onChange={(e) => updateField("graduationYear", e.target.value)}
                    disabled={!editing}
                    min={1900}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
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
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
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
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
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
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {editing && (
                <>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Ubah Password (kosongkan jika tidak ingin mengubah)
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password Baru
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                        Konfirmasi Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateField("confirmPassword", e.target.value)
                        }
                        placeholder="Ulangi password baru"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setMessage(null);
                      if (alumni) {
                        setForm({
                          name: alumni.name || "",
                          email: alumni.email || "",
                          contactNumber: alumni.contactNumber || "",
                          graduationYear: alumni.graduationYear?.toString() || "",
                          degree: alumni.degree || "",
                          specialization: alumni.specialization || "",
                          institution: alumni.institution || "",
                          password: "",
                          confirmPassword: "",
                        });
                        setPhotoPreview(alumni.photo || "");
                        setPhotoFile(null);
                        setRemovePhoto(false);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-dark text-white rounded-xl hover:bg-brand-dark-hover text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full px-4 py-2.5 bg-brand-dark text-white rounded-xl hover:bg-brand-dark-hover text-sm font-medium transition-colors"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
