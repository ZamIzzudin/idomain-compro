"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "@/services/setting/hook";
import { parseImageUrl } from "@/services/setting/service";

export default function SplashScreen({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const { data: settings, isLoading } = useSiteSettings();
  const [visible, setVisible] = useState(true);
  const siteName = settings?.site_name || "IDOMAIN";
  const logo = parseImageUrl(settings?.site_logo);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinished, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinished, isLoading]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-brand-steel flex flex-col items-center justify-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {logo ? (
        <img
          src={logo}
          alt={siteName}
          className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-2xl mb-6 animate-pulse"
        />
      ) : (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <span className="text-white text-3xl md:text-4xl font-bold">
            {siteName.charAt(0)}
          </span>
        </div>
      )}
      <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
        Selamat Datang
      </h1>
      <p className="text-white/60 text-sm mt-2">{siteName}</p>
    </div>
  );
}
