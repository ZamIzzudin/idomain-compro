"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/atomic/container";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
import { ArrowLeft, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import ListInput from "@/components/atomic/list-input";
import { useCreateCareer, useCategoryList } from "@/services/career/hook";
import { useMyProfile } from "@/services/alumni/hook";
import { isAuthenticated } from "@/lib/auth";
import locationData from "@/data/location.json";

const jobTypes = ["Penuh Waktu", "Paruh Waktu", "Kontrak", "Magang", "Lepas"];

const provinces = (locationData as any).data.map((l: any) => l.provinsi);
const getProvinceCities = (prov: string) =>
  (locationData as any).data.find((l: any) => l.provinsi === prov)?.kota || [];

export default function CareerNewPage() {
  const router = useRouter();
  const { data: alumni } = useMyProfile();
  const { data: categories } = useCategoryList();
  const { mutate: create, isPending } = useCreateCareer();

  const [form, setForm] = useState({
    title: "",
    institutionName: "",
    position: "",
    province: "",
    city: "",
    jobType: "Penuh Waktu",
    categoryId: "",
    description: [] as string[],
    requirements: [] as string[],
    deadline: "",
    recruitmentEmail: "",
    recruitmentUrl: "",
    contactPerson: "",
    contactPhone: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (form.province) {
      setCities(getProvinceCities(form.province));
      setForm((p) => ({ ...p, city: "" }));
    } else {
      setCities([]);
    }
  }, [form.province]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/alumni/login");
    }
  }, [router]);

  if (!alumni) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">
              Anda harus login sebagai alumni untuk posting lowongan
            </p>
            <Link
              href="/alumni/login"
              className="inline-block px-6 py-3 bg-brand-steel text-white rounded-xl text-sm font-medium hover:bg-brand-steel/80"
            >
              Login Alumni
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.position || !form.institutionName || !form.categoryId) {
      toast.error("Posisi, institusi, dan kategori wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.position);
    formData.append("institutionName", form.institutionName);
    formData.append("position", form.position);
    if (form.province) formData.append("province", form.province);
    if (form.city) formData.append("city", form.city);
    formData.append("jobType", form.jobType);
    formData.append("categoryId", form.categoryId);
    if (form.description.length > 0) formData.append("description", form.description.filter(Boolean).join("\n"));
    if (form.requirements.length > 0) formData.append("requirements", form.requirements.filter(Boolean).join("\n"));
    if (form.deadline) formData.append("deadline", form.deadline);
    if (form.recruitmentEmail)
      formData.append("recruitmentEmail", form.recruitmentEmail);
    if (form.recruitmentUrl)
      formData.append("recruitmentUrl", form.recruitmentUrl);
    if (form.contactPerson)
      formData.append("contactPerson", form.contactPerson);
    if (form.contactPhone) formData.append("contactPhone", form.contactPhone);
    if (logo) formData.append("logo", logo);

    create(formData, {
      onSuccess: () => {
        toast.success("Lowongan berhasil dikirim! Menunggu persetujuan admin.");
        router.push("/career");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Gagal mengirim lowongan",
        );
      },
    });
  };

  return (
    <Container>
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            <Briefcase className="w-8 h-8" />
            Posting Lowongan
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint mx-auto" />
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 bg-gray-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-steel mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

          <AnimateOnScroll>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Posisi yang Dibutuhkan *
                </label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, position: e.target.value }))
                  }
                  placeholder="contoh: Dokter Umum"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Institusi / Perusahaan *
                </label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, institutionName: e.target.value }))
                  }
                  placeholder="contoh: RSUP Dr. Ciptomangunkusumo"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Provinsi
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, province: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  >
                    <option value="">Pilih provinsi...</option>
                    {provinces.map((p: string) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kota/Kabupaten
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, city: e.target.value }))
                    }
                    disabled={!form.province}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih kota...</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Jenis Pekerjaan
                  </label>
                  <select
                    value={form.jobType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, jobType: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  >
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kategori Lowongan *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  >
                    <option value="">Pilih kategori...</option>
                    <optgroup label="Klinis">
                      {categories
                        ?.filter((c) => c.type === "KLINIS")
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Non-Klinis">
                      {categories
                        ?.filter((c) => c.type === "NON_KLINIS")
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Batas Waktu Lamaran
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, deadline: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deskripsi Pekerjaan
                </label>
                <ListInput
                  items={form.description}
                  onChange={(items) => setForm((p) => ({ ...p, description: items }))}
                  placeholder="Deskripsi pekerjaan..."
                  addLabel="Tambah Deskripsi"
                  emptyLabel="Belum ada deskripsi. Klik tambah untuk menambahkan."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Persyaratan
                </label>
                <ListInput
                  items={form.requirements}
                  onChange={(items) => setForm((p) => ({ ...p, requirements: items }))}
                  placeholder="Persyaratan..."
                  addLabel="Tambah Persyaratan"
                  emptyLabel="Belum ada persyaratan. Klik tambah untuk menambahkan."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Rekrutmen
                  </label>
                  <input
                    type="email"
                    value={form.recruitmentEmail}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        recruitmentEmail: e.target.value,
                      }))
                    }
                    placeholder="hr@institusi.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Link Pendaftaran / Website
                  </label>
                  <input
                    type="url"
                    value={form.recruitmentUrl}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        recruitmentUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contactPerson: e.target.value }))
                    }
                    placeholder="Nama kontak (opsional)"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nomor Telepon Kontak (Opsional)
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        contactPhone: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 14),
                      }))
                    }
                    placeholder="08xxxxxxxxxxx"
                    maxLength={14}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-steel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Logo Institusi (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-mint/30 file:text-brand-steel hover:file:bg-brand-mint/50"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                Lowongan yang Anda posting akan masuk ke status{" "}
                <strong>Pending Review</strong> dan akan ditampilkan setelah
                disetujui oleh administrator.
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/80 transition-colors disabled:opacity-50"
              >
                {isPending ? "Mengirim..." : "Kirim Lowongan"}
              </button>
            </form>
          </AnimateOnScroll>
        </div>
      </section>
    </Container>
  );
}
