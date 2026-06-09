/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSiteSettings } from "@/services/setting/hook";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const { data: settings, isLoading } = useSiteSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: string[] = (() => {
    const raw = settings?.hero_banners;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const hasMultiple = banners.length > 1;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [hasMultiple, goToNext]);

  if (isLoading) {
    return (
      <section className="w-full h-[100dvh] bg-gradient-to-br from-[#135292] via-[#0e3d6e] to-[#135292] animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return (
      <section className="w-full h-[100dvh] bg-gradient-to-br from-[#135292] via-[#0e3d6e] to-[#135292]" />
    );
  }

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      {/* Slides */}
      {banners.map((url, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <img
            src={url}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Previous / Next Buttons */}
      {hasMultiple && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
