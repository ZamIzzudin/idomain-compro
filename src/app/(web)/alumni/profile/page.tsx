/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/atomic/container";
import ConfirmModal from "@/components/ConfirmModal";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Upload,
  X,
  Save,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  useMyProfile,
  useUpdateMyProfile,
  useMyWorkHistories,
  useCreateWorkHistory,
  useUpdateWorkHistory,
  useDeleteWorkHistory,
} from "@/services/alumni/hook";
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
  const { data: workHistories, isLoading: loadingWH } = useMyWorkHistories();
  const { mutate: createWH, isPending: creatingWH } = useCreateWorkHistory();
  const { mutate: updateWH, isPending: updatingWH } = useUpdateWorkHistory();
  const { mutate: deleteWH } = useDeleteWorkHistory();

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
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
    password: "",
    confirmPassword: "",
    emailVisible: true,
    contactNumberVisible: true,
  });

  const [profileCities, setProfileCities] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  // Work history state
  const [showWHForm, setShowWHForm] = useState(false);
  const [editingWH, setEditingWH] = useState<number | null>(null);
  const [whForm, setWhForm] = useState({
    institutionName: "",
    startYear: "",
    endYear: "",
    province: "",
    provinceCustom: "",
    city: "",
    cityCustom: "",
  });
  const [whCities, setWhCities] = useState<string[]>([]);

  // Populate form when alumni data loads
  useEffect(() => {
    if (alumni) {
      // Resolve dropdown values: check if the value exists in the list, otherwise use "Lainnya"
      const resolveDropdown = (
        value: string | null | undefined,
        options: string[],
      ) => {
        if (!value) return "";
        if (options.includes(value)) return value;
        return "Lainnya";
      };

      const currentProvince = alumni.province || "";
      const provinceOptions = provinces;
      const resolvedProvince = resolveDropdown(
        currentProvince,
        provinceOptions,
      );

      let resolvedCity = "";
      let cityManualVal = "";
      if (alumni.city) {
        const cityOptions = currentProvince
          ? getProvinceCities(currentProvince)
          : [];
        if (cityOptions.includes(alumni.city)) {
          resolvedCity = alumni.city;
        } else {
          resolvedCity = "Lainnya";
          cityManualVal = alumni.city;
        }
      }

      setForm({
        name: alumni.name || "",
        email: alumni.email || "",
        contactNumber: alumni.contactNumber || "",
        graduationYear: alumni.graduationYear?.toString() || "",
        batch: (alumni as any).batch?.toString() || "",
        degreePrefix: resolveDropdown(
          alumni.degreePrefix,
          degreePrefixes.map((d) => d.label),
        ),
        degreePrefixCustom:
          alumni.degreePrefix &&
          !degreePrefixes.map((d) => d.label).includes(alumni.degreePrefix)
            ? alumni.degreePrefix
            : "",
        degreeSuffix: resolveDropdown(
          alumni.degreeSuffix,
          degreeSuffixes.map((d) => d.label),
        ),
        degreeSuffixCustom:
          alumni.degreeSuffix &&
          !degreeSuffixes.map((d) => d.label).includes(alumni.degreeSuffix)
            ? alumni.degreeSuffix
            : "",
        specialization: resolveDropdown(
          alumni.specialization,
          specializationData,
        ),
        specializationCustom:
          alumni.specialization &&
          !specializationData.includes(alumni.specialization)
            ? alumni.specialization
            : "",
        province: resolvedProvince,
        provinceCustom:
          currentProvince && !provinces.includes(currentProvince)
            ? currentProvince
            : "",
        city: resolvedCity,
        cityCustom: cityManualVal,
        password: "",
        confirmPassword: "",
        emailVisible: alumni.emailVisible !== false,
        contactNumberVisible: alumni.contactNumberVisible !== false,
      });

      if (currentProvince && provinces.includes(currentProvince)) {
        setProfileCities(getProvinceCities(currentProvince));
      }

      setPhotoPreview(alumni.photo || "");
    }
  }, [alumni]);

  // Update profile cities when province changes (edit mode)
  useEffect(() => {
    if (form.province && form.province !== "Lainnya") {
      setProfileCities(getProvinceCities(form.province));
    } else {
      setProfileCities([]);
    }
  }, [form.province]);

  // Update work history cities when province changes
  useEffect(() => {
    if (whForm.province && whForm.province !== "Lainnya") {
      setWhCities(getProvinceCities(whForm.province));
    } else {
      setWhCities([]);
    }
  }, [whForm.province]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => {
      if (field === "emailVisible" || field === "contactNumberVisible") {
        return { ...prev, [field]: value === "true" };
      }
      return { ...prev, [field]: value };
    });
  };

  const updateWHField = (field: string, value: string) => {
    setWhForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "province") {
        next.city = "";
        next.cityCustom = "";
      }
      return next;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
      );
      return;
    }
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > 1 * 1024 * 1024) {
      toast.error(`Ukuran file (${sizeMB} MB) melebihi batas maksimal 1 MB.`);
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
    if (!form.name) {
      toast.error("Nama wajib diisi");
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
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

    const payload: any = {
      name: form.name,
      email: form.email || null,
      contactNumber: form.contactNumber || null,
      graduationYear: parseInt(form.graduationYear) || undefined,
      batch: form.batch ? parseInt(form.batch) : null,
      degreePrefix: finalDegreePrefix || null,
      degreeSuffix: finalDegreeSuffix || null,
      specialization: finalSpecialization || null,
      province: finalProvince || null,
      city: finalCity || null,
    };

    if (form.password) {
      payload.password = form.password;
    }

    payload.emailVisible = form.emailVisible;
    payload.contactNumberVisible = form.contactNumberVisible;

    if (photoFile) {
      const url = await uploadPhoto(photoFile);
      if (url) payload.photo = url;
    } else if (removePhoto) {
      payload.removePhoto = true;
    }

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Profil berhasil diperbarui");
        setEditing(false);
        setPhotoFile(null);
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Gagal memperbarui profil",
        );
      },
    });
  };

  const resetForm = () => {
    setEditing(false);
    if (alumni) {
      const resolveDropdown = (
        value: string | null | undefined,
        options: string[],
      ) => {
        if (!value) return "";
        if (options.includes(value)) return value;
        return "Lainnya";
      };

      const currentProvince = alumni.province || "";

      let resolvedCity = "";
      let cityManualVal = "";
      if (alumni.city) {
        const cityOptions = currentProvince
          ? getProvinceCities(currentProvince)
          : [];
        if (cityOptions.includes(alumni.city)) {
          resolvedCity = alumni.city;
        } else {
          resolvedCity = "Lainnya";
          cityManualVal = alumni.city;
        }
      }

      setForm({
        name: alumni.name || "",
        email: alumni.email || "",
        contactNumber: alumni.contactNumber || "",
        graduationYear: alumni.graduationYear?.toString() || "",
        batch: (alumni as any).batch?.toString() || "",
        degreePrefix: resolveDropdown(
          alumni.degreePrefix,
          degreePrefixes.map((d) => d.label),
        ),
        degreePrefixCustom:
          alumni.degreePrefix &&
          !degreePrefixes.map((d) => d.label).includes(alumni.degreePrefix)
            ? alumni.degreePrefix
            : "",
        degreeSuffix: resolveDropdown(
          alumni.degreeSuffix,
          degreeSuffixes.map((d) => d.label),
        ),
        degreeSuffixCustom:
          alumni.degreeSuffix &&
          !degreeSuffixes.map((d) => d.label).includes(alumni.degreeSuffix)
            ? alumni.degreeSuffix
            : "",
        specialization: resolveDropdown(
          alumni.specialization,
          specializationData,
        ),
        specializationCustom:
          alumni.specialization &&
          !specializationData.includes(alumni.specialization)
            ? alumni.specialization
            : "",
        province: resolveDropdown(currentProvince, provinces),
        provinceCustom:
          currentProvince && !provinces.includes(currentProvince)
            ? currentProvince
            : "",
        city: resolvedCity,
        cityCustom: cityManualVal,
        password: "",
        confirmPassword: "",
        emailVisible: alumni.emailVisible !== false,
        contactNumberVisible: alumni.contactNumberVisible !== false,
      });

      if (currentProvince && provinces.includes(currentProvince)) {
        setProfileCities(getProvinceCities(currentProvince));
      }

      setPhotoPreview(alumni.photo || "");
      setPhotoFile(null);
      setRemovePhoto(false);
    }
  };

  // Work History handlers
  const openAddWH = () => {
    setEditingWH(null);
    setWhForm({
      institutionName: "",
      startYear: "",
      endYear: "",
      province: "",
      provinceCustom: "",
      city: "",
      cityCustom: "",
    });
    setWhCities([]);
    setShowWHForm(true);
  };

  const openEditWH = (wh: any) => {
    setEditingWH(wh.id);
    const resolveDropdown = (
      value: string | null | undefined,
      options: string[],
    ) => {
      if (!value) return "";
      if (options.includes(value)) return value;
      return "Lainnya";
    };

    const whProvince = wh.province || "";
    const resolvedWHProvince = resolveDropdown(whProvince, provinces);

    let resolvedWHCity = "";
    let whCityManual = "";
    if (wh.city) {
      const cityOptions = whProvince ? getProvinceCities(whProvince) : [];
      if (cityOptions.includes(wh.city)) {
        resolvedWHCity = wh.city;
      } else {
        resolvedWHCity = "Lainnya";
        whCityManual = wh.city;
      }
    }

    setWhForm({
      institutionName: wh.institutionName || "",
      startYear: wh.startYear?.toString() || "",
      endYear: wh.endYear?.toString() || "",
      province: resolvedWHProvince,
      provinceCustom:
        whProvince && !provinces.includes(whProvince) ? whProvince : "",
      city: resolvedWHCity,
      cityCustom: whCityManual,
    });

    if (whProvince && provinces.includes(whProvince)) {
      setWhCities(getProvinceCities(whProvince));
    }
    setShowWHForm(true);
  };

  const handleSaveWH = () => {
    const finalProvince =
      whForm.province === "Lainnya" ? whForm.provinceCustom : whForm.province;
    const finalCity =
      whForm.city === "Lainnya" ? whForm.cityCustom : whForm.city;

    const payload: any = {
      institutionName: whForm.institutionName,
      startYear: parseInt(whForm.startYear) || 0,
      endYear: whForm.endYear ? parseInt(whForm.endYear) : null,
      province: finalProvince || null,
      city: finalCity || null,
    };

    if (editingWH) {
      updateWH(
        { id: editingWH, ...payload },
        {
          onSuccess: () => {
            setShowWHForm(false);
            setEditingWH(null);
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Gagal memperbarui riwayat kerja",
            );
          },
        },
      );
    } else {
      createWH(payload, {
        onSuccess: () => {
          setShowWHForm(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Gagal menambahkan riwayat kerja",
          );
        },
      });
    }
  };

  const [deleteWHTarget, setDeleteWHTarget] = useState<{ id: number; name: string } | null>(null);

  const handleDeleteWH = (wh: any) => {
    setDeleteWHTarget({ id: wh.id, name: wh.institutionName });
  };

  const confirmDeleteWH = () => {
    if (!deleteWHTarget) return;
    deleteWH(deleteWHTarget.id, {
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Gagal menghapus riwayat kerja",
        );
      },
      onSettled: () => setDeleteWHTarget(null),
    });
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <Container>
        <section className="bg-brand-steel text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse h-10 bg-white/20 rounded w-64 mx-auto mb-3" />
          </div>
        </section>
        <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
          <div className="max-w-2xl mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-slate-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </section>
      </Container>
    );
  }

  const whList = workHistories || [];

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-steel text-white py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center flex items-center flex-col">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            Profil Saya
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-steel mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

          {/* Approval status banner */}
          {alumni && !alumni.isApproved && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 mb-6 text-sm">
              <p className="font-medium">Akun belum disetujui</p>
              <p>
                Data Anda belum tampil di halaman alumni. Menunggu persetujuan
                admin.
              </p>
            </div>
          )}

          {/* Profile Card */}
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
                      <span className="text-[10px] text-slate-400 mt-0.5">
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
              {/* Gelar + Nama in one row */}
              {editing ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gelar Depan
                  </label>
                  <div className="flex gap-2 items-end">
                    <div className="w-32 shrink-0">
                      <select
                        value={form.degreePrefix}
                        onChange={(e) =>
                          updateField("degreePrefix", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
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
                          className="w-full mt-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
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
                    <div className="w-32 shrink-0">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Gelar Belakang
                      </label>
                      <select
                        value={form.degreeSuffix}
                        onChange={(e) =>
                          updateField("degreeSuffix", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
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
                          className="w-full mt-2 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={
                      [alumni?.degreePrefix, alumni?.name, alumni?.degreeSuffix]
                        .filter(Boolean)
                        .join(" ") || "-"
                    }
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  {editing && (
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.emailVisible}
                        onChange={(e) =>
                          updateField("emailVisible", String(e.target.checked))
                        }
                        className="accent-brand-dark rounded"
                      />
                      Tampilkan
                    </label>
                  )}
                  {!editing && !form.emailVisible && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Tersembunyi
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Contact Number & Graduation Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Nomor Kontak
                    </label>
                    {editing && (
                      <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.contactNumberVisible}
                          onChange={(e) =>
                            updateField(
                              "contactNumberVisible",
                              String(e.target.checked),
                            )
                          }
                          className="accent-brand-dark rounded"
                        />
                        Tampilkan
                      </label>
                    )}
                    {!editing && !form.contactNumberVisible && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        Tersembunyi
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) =>
                      updateField("contactNumber", e.target.value)
                    }
                    maxLength={14}
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
                    onChange={(e) =>
                      updateField("graduationYear", e.target.value)
                    }
                    disabled={!editing}
                    min={1900}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Batch (Tahun Masuk) */}
              {editing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tahun Masuk
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
              )}

              {/* Specialization */}
              {editing ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Spesialisasi
                  </label>
                  <input
                    type="text"
                    value={alumni?.specialization || "-"}
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                  />
                </div>
              )}

              {/* Province & City */}
              {editing ? (
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
                    profileCities.length > 0 ? (
                      <>
                        <select
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                        >
                          <option value="">-- Pilih Kota/Kab --</option>
                          {profileCities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="Lainnya">
                            Lainnya (input manual)
                          </option>
                        </select>
                        {form.city === "Lainnya" && (
                          <input
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
                        type="text"
                        value={form.cityCustom}
                        onChange={(e) =>
                          updateField("cityCustom", e.target.value)
                        }
                        placeholder="Masukkan kota/kabupaten"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Provinsi
                    </label>
                    <input
                      type="text"
                      value={alumni?.province || "-"}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kota / Kabupaten
                    </label>
                    <input
                      type="text"
                      value={alumni?.city || "-"}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Password (only in edit mode) */}
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
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
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

            {/* Profile Actions */}
            <div className="flex gap-3 pt-2">
              {editing ? (
                <>
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-steel text-white rounded-xl hover:bg-brand-steel/70 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full px-4 py-2.5 bg-brand-steel text-white rounded-xl hover:bg-brand-steel/70 text-sm font-medium transition-colors"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>

          {/* Work History Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-steel" />
                Riwayat Pekerjaan
              </h2>
              {!showWHForm && (
                <button
                  onClick={openAddWH}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-steel text-white rounded-xl text-sm font-medium hover:bg-brand-steel/70 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              )}
            </div>

            {/* Work History List */}
            {loadingWH ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : whList.length === 0 && !showWHForm ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  Belum ada riwayat pekerjaan
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {whList.map((wh) => (
                  <div
                    key={wh.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">
                        {wh.institutionName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {wh.startYear}
                          {wh.endYear ? ` - ${wh.endYear}` : " - Sekarang"}
                        </span>
                        {(wh.province || wh.city) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[wh.city, wh.province].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditWH(wh)}
                        className="p-1.5 text-slate-400 hover:text-brand-steel hover:bg-slate-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWH(wh)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Work History Form */}
            {showWHForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  {editingWH
                    ? "Edit Riwayat Pekerjaan"
                    : "Tambah Riwayat Pekerjaan"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Institusi *
                  </label>
                  <input
                    type="text"
                    value={whForm.institutionName}
                    onChange={(e) =>
                      updateWHField("institutionName", e.target.value)
                    }
                    placeholder="Nama institusi/instansi"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tahun Mulai *
                    </label>
                    <input
                      type="number"
                      value={whForm.startYear}
                      onChange={(e) =>
                        updateWHField("startYear", e.target.value)
                      }
                      placeholder="2020"
                      min={1900}
                      max={2100}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tahun Selesai (opsional)
                    </label>
                    <input
                      type="number"
                      value={whForm.endYear}
                      onChange={(e) => updateWHField("endYear", e.target.value)}
                      placeholder="Kosongkan jika masih aktif"
                      min={1900}
                      max={2100}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Provinsi
                    </label>
                    <select
                      value={whForm.province}
                      onChange={(e) =>
                        updateWHField("province", e.target.value)
                      }
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
                    {whForm.province === "Lainnya" && (
                      <input
                        type="text"
                        value={whForm.provinceCustom}
                        onChange={(e) =>
                          updateWHField("provinceCustom", e.target.value)
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
                    {whForm.province &&
                    whForm.province !== "Lainnya" &&
                    whCities.length > 0 ? (
                      <>
                        <select
                          value={whForm.city}
                          onChange={(e) =>
                            updateWHField("city", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                        >
                          <option value="">-- Pilih Kota/Kab --</option>
                          {whCities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="Lainnya">
                            Lainnya (input manual)
                          </option>
                        </select>
                        {whForm.city === "Lainnya" && (
                          <input
                            type="text"
                            value={whForm.cityCustom}
                            onChange={(e) =>
                              updateWHField("cityCustom", e.target.value)
                            }
                            placeholder="Masukkan kota/kabupaten"
                            className="w-full mt-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                          />
                        )}
                      </>
                    ) : (
                      <input
                        type="text"
                        value={whForm.cityCustom}
                        onChange={(e) =>
                          updateWHField("cityCustom", e.target.value)
                        }
                        placeholder="Masukkan kota/kabupaten"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowWHForm(false);
                      setEditingWH(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveWH}
                    disabled={creatingWH || updatingWH}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-steel text-white rounded-xl hover:bg-brand-steel/70 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {creatingWH || updatingWH ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmModal
        open={!!deleteWHTarget}
        title="Hapus Riwayat Pekerjaan"
        message={`Apakah Anda yakin ingin menghapus riwayat pekerjaan di "${deleteWHTarget?.name}"?`}
        confirmLabel="Ya, Hapus"
        onConfirm={confirmDeleteWH}
        onCancel={() => setDeleteWHTarget(null)}
      />
    </Container>
  );
}
