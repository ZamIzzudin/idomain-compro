/** @format */

"use client";

import Container from "@/components/atomic/container";
import { useSiteSettings } from "@/services/setting/hook";

export default function AboutPage() {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || "IDOMAIN";
  const aboutDesc = settings?.about_description || "IDOMAIN didirikan dengan visi untuk menjadi organisasi yang berdampak positif bagi masyarakat. Kami percaya bahwa kolaborasi dan kebersamaan adalah kunci untuk mencapai tujuan bersama.";
  const aboutVisi = settings?.about_visi || "";
  const aboutMisi = settings?.about_misi || "";
  const aboutImage = settings?.about_image;

  const misiItems = aboutMisi ? aboutMisi.split("\n").filter(Boolean) : [
    "Memperkuat Jejaring — Membangun jaringan yang kuat antar anggota dan mitra.",
    "Kolaborasi — Memfasilitasi kerjasama lintas bidang untuk dampak yang lebih besar.",
    "Kontribusi — Berperan aktif dalam kegiatan sosial dan pembangunan masyarakat.",
  ];

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4">
            Tentang {siteName}
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Mengenal lebih dekat tentang organisasi kami
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {aboutImage ? (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={aboutImage} alt="About" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-dark to-brand-dark-hover rounded-2xl flex items-center justify-center">
                <span className="text-white/50">About Image</span>
              </div>
            )}
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Sejarah & Visi
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {aboutDesc}
              </p>
              {aboutVisi && (
                <div className="bg-brand-dark/5 rounded-xl p-4 border border-brand-dark/10">
                  <h3 className="font-semibold text-brand-dark text-sm mb-1">Visi</h3>
                  <p className="text-sm text-gray-600">{aboutVisi}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Misi Kami
            </h2>
            <div className={`grid grid-cols-1 ${misiItems.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
              {misiItems.map((item, i) => {
                const parts = item.split(" — ");
                return (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-brand-dark mb-2">
                      {parts[0]?.trim() || `Misi ${i + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {parts[1]?.trim() || item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
