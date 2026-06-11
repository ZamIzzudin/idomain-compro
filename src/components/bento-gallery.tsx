/** @format */
"use client";

import { useSiteSettings } from "@/services/setting/hook";

export default function BentoGallery() {
  const { data: settings } = useSiteSettings();

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

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 flex justify-center gap-3">
          <h2 className="text-[24px] md:text-[52px] font-bold text-brand-steel">
            Galeri
          </h2>
          <div className="h-7 w-7 bg-brand-mint"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {images.map((src, idx) => {
            const cls = bentoClasses[idx % bentoClasses.length];
            return (
              <div
                key={idx}
                className={`relative rounded-2xl overflow-hidden group ${cls}`}
              >
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
