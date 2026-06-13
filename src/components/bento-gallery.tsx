/** @format */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";
import AnimateOnScroll from "./atomic/animate-on-scroll";

export default function BentoGallery() {
  const { data: settings } = useSiteSettings();
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const galleryRaw = settings?.about_gallery;
  let images: string[] = [];

  if (galleryRaw) {
    try {
      const parsed = JSON.parse(galleryRaw);
      if (Array.isArray(parsed)) {
        images = parsed;
      }
    } catch {
      // ignore
    }
  }

  if (images.length === 0) return null;

  // Bento layout classes per position (up to 6 visible items)
  // Pattern: 1 large + 2 small on top row, 2 small + 1 large on bottom row
  const bentoClasses = [
    "row-span-2 col-span-1 md:col-span-1", // 0: tall left
    "col-span-1 md:col-span-1 row-span-1", // 1: small
    "col-span-1 md:col-span-1 row-span-1", // 2: small
    "col-span-1 md:col-span-2 row-span-1", // 3: wide
    "col-span-1 md:col-span-1 row-span-1", // 4: small
    "col-span-1 md:col-span-1 row-span-1", // 5: small
  ];

  const navigate = (dir: "prev" | "next") => {
    if (previewIdx === null) return;
    if (dir === "prev") setPreviewIdx(previewIdx > 0 ? previewIdx - 1 : images.length - 1);
    if (dir === "next") setPreviewIdx(previewIdx < images.length - 1 ? previewIdx + 1 : 0);
  };

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-10 flex justify-center gap-3">
            <h2 className="text-[24px] md:text-[52px] font-bold text-brand-steel">
              Galeri
            </h2>
            <div className="h-7 w-7 bg-brand-mint"></div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {images.map((src, idx) => {
            const cls = bentoClasses[idx % bentoClasses.length];
            return (
              <button
                key={idx}
                onClick={() => setPreviewIdx(idx)}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${cls}`}
              >
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            );
          })}
          </div>
        </AnimateOnScroll>
      </div>

      {/* Lightbox Preview */}
      {previewIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewIdx(null)}
        >
          <button
            onClick={() => setPreviewIdx(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <img
            src={images[previewIdx]}
            alt={`Gallery ${previewIdx + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {previewIdx + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
