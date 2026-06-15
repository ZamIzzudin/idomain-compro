/** @format */
"use client";

import Button from "./atomic/button";
import AnimateOnScroll from "./atomic/animate-on-scroll";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/services/setting/hook";
import { parseImageUrl } from "@/services/setting/service";

export default function AboutSection() {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || "iDomain";
  const aboutTitle =
    settings?.home_about_title ||
    settings?.about_title ||
    `Tentang ${siteName}`;
  const aboutDesc =
    settings?.home_about_description ||
    settings?.about_description ||
    "iDomain adalah organisasi yang berdedikasi untuk memperkuat jejaring antar anggota, memfasilitasi kolaborasi lintas bidang, dan berkontribusi positif bagi masyarakat luas. Melalui berbagai program dan kegiatan, kami terus berupaya menciptakan dampak yang bermakna.";
  const aboutImage =
    parseImageUrl(settings?.home_about_image) ||
    parseImageUrl(settings?.about_image);

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-7xl mx-auto">
        {/* Image */}
        <AnimateOnScroll variant="slide-left">
          <div className="flex items-center justify-center">
            {aboutImage ? (
              <div className="w-full max-w-[450px] aspect-square rounded-2xl overflow-hidden">
                <img
                  src={aboutImage}
                  alt={aboutTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full max-w-[450px] aspect-square bg-gradient-to-br from-brand-dark to-brand-dark-hover rounded-2xl flex items-center justify-center">
                <span className="text-white/50 text-lg">About Image</span>
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* Text */}
        <AnimateOnScroll variant="slide-right">
          <div className="space-y-5">
            <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900">
              Tentang <span className="text-brand-steel">{siteName}</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">{aboutDesc}</p>
            <div className="text-xs">
              <Link href="/about">
                <Button
                  label="Selengkapnya"
                  type="default"
                  icon={<ArrowRight size={18} />}
                />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
