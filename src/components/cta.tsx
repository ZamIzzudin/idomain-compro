/** @format */
"use client";

import Button from "./atomic/button";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";

export default function CTASection() {
  const { data: settings } = useSiteSettings();

  const title = settings?.cta_title || "Bergabung Bersama Kami";
  const desc = settings?.cta_description || "Mari berkolaborasi dan berkontribusi bersama untuk menciptakan dampak positif bagi masyarakat. Hubungi kami untuk informasi lebih lanjut.";
  const btnText = settings?.cta_button_text || "Hubungi Kami";
  const btnUrl = settings?.cta_button_url || "/contact";

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full bg-brand-dark text-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-[28px] md:text-[40px] font-bold">
          {title}
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            label={btnText}
            rounded
            type="default"
            icon={<ArrowRight size={18} />}
            onClick={() => (window.location.href = btnUrl)}
          />
        </div>
      </div>
    </section>
  );
}
