/** @format */
"use client";

import Button from "./atomic/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/services/setting/hook";

export default function CTASection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] pb-8 md:pb-12 w-full text-white flex gap-8">
      <div className="max-w-4xl mx-auto text-left space-y-2 bg-brand-steel p-6 rounded-2xl flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Bergabung</h2>
        <p className="text-white text-xs max-w-2xl mx-auto leading-relaxed">
          Mari berkolaborasi dan berkontribusi bersama untuk menciptakan dampak
          positif bagi masyarakat. Hubungi kami untuk informasi lebih lanjut.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-3 text-xs">
          <Link href="/alumni/register">
            <Button
              label="Daftar Sebagai Alumni"
              type="default"
              icon={<ArrowRight size={18} />}
            />
          </Link>
        </div>
      </div>
      {/* <div className="flex items-center justify-center text-brand-steel">
        <span className="font-semibold">atau</span>
      </div> */}
      <div className="max-w-4xl mx-auto text-left space-y-2 bg-brand-steel p-6 rounded-2xl flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Kerja Sama</h2>
        <p className="text-white text-xs max-w-2xl mx-auto leading-relaxed">
          Mari berkolaborasi dan berkontribusi bersama untuk menciptakan dampak
          positif bagi masyarakat. Hubungi kami untuk informasi lebih lanjut.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-3 text-xs">
          <Link href="/contact">
            <Button
              label="Hubungi Kami"
              type="default"
              icon={<ArrowRight size={18} />}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
