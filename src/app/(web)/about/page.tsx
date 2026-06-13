/** @format */

"use client";

import Container from "@/components/atomic/container";
import BentoGallery from "@/components/bento-gallery";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
import { useSiteSettings } from "@/services/setting/hook";

export default function AboutPage() {
  const { data: settings } = useSiteSettings();

  const aboutTitle = settings?.about_title || "Tentang perusahan";
  const aboutDesc =
    settings?.about_description ||
    "IDOMAIN didirikan dengan visi untuk menjadi organisasi yang berdampak positif bagi masyarakat. Kami percaya bahwa kolaborasi dan kebersamaan adalah kunci untuk mencapai tujuan bersama.";
  const aboutVisi = settings?.about_visi || "";
  const aboutMisi = settings?.about_misi || "";
  const aboutImage = settings?.about_image;

  let misiItems: Array<{ title: string; subtitle: string }> = [];
  if (aboutMisi) {
    try {
      const parsed = JSON.parse(aboutMisi);
      if (Array.isArray(parsed)) {
        misiItems = parsed;
      }
    } catch {
      // Legacy format: plain text with newlines, parse with " — " separator
      misiItems = aboutMisi
        .split("\n")
        .filter(Boolean)
        .map((line: string) => {
          const parts = line.split(" — ");
          return {
            title: parts[0]?.trim() || "",
            subtitle: parts[1]?.trim() || line.trim(),
          };
        });
    }
  }

  if (misiItems.length === 0) {
    misiItems = [
      {
        title: "Memperkuat Jejaring",
        subtitle: "Membangun jaringan yang kuat antar anggota dan mitra.",
      },
      {
        title: "Kolaborasi",
        subtitle:
          "Memfasilitasi kerjasama lintas bidang untuk dampak yang lebih besar.",
      },
      {
        title: "Kontribusi",
        subtitle:
          "Berperan aktif dalam kegiatan sosial dan pembangunan masyarakat.",
      },
    ];
  }

  return (
    <Container>
      {/* Hero */}
      <section className="text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full bg-brand-steel text-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-2">
          <h1 className="text-[28px] md:text-[48px] font-bold">Tentang Kami</h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      {/* Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
        <div className="max-w-full mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <AnimateOnScroll variant="slide-left">
              {aboutImage ? (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={aboutImage}
                    alt="About"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-dark to-brand-dark-hover rounded-2xl flex items-center justify-center">
                  <span className="text-white/50">About Image</span>
                </div>
              )}
            </AnimateOnScroll>
            <AnimateOnScroll variant="slide-right">
              <div className="space-y-5">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-steel">
                  {aboutTitle}
                </h2>
                <p className="text-gray-600 leading-relaxed">{aboutDesc}</p>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              {aboutVisi && (
                <div className="flex gap-3">
                  <div className="h-3 w-3 bg-brand-mint"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-steel mb-6">
                    Visi
                  </h2>
                </div>
              )}
              <p className="text-sm text-gray-600">{aboutVisi}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="flex gap-3">
                <div className="h-3 w-3 bg-brand-mint"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-steel mb-6">
                  Misi Kami
                </h2>
              </div>

              <div
                className={`grid grid-cols-1 ${misiItems.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}
              >
                {misiItems.map((item, i) => (
                  <AnimateOnScroll key={i} delay={i * 0.1}>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-brand-dark mb-2">
                        {item.title || `Misi ${i + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Bento Gallery */}
      <BentoGallery />
    </Container>
  );
}
