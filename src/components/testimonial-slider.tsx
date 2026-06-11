/** @format */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePublishedTestimonials } from "@/services/testimonial/hook";

function TestimonialCard({
  item,
}: {
  item: {
    testimonial: string;
    name: string;
    institution?: string | null;
    photo?: string | null;
  };
}) {
  return (
    <div className="bg-white/20 border border-brand-dark-hover rounded-2xl px-4 py-5 flex-shrink-0 w-full">
      <div className="min-h-[120px] flex flex-col items-start justify-center gap-3">
        <p className="text-white text-sm leading-relaxed font-light italic text-left">
          &ldquo;{item.testimonial}&rdquo;
        </p>
        <div className="flex gap-2 justify-between w-full items-center">
          <div className="space-y-1">
            <p className="text-white font-semibold text-base">{item.name}</p>
            {item.institution && (
              <div className="flex gap-2 items-center">
                <span className="w-[25px] bg-brand-mint-green h-[5px] block" />
                <p className="text-gray-300 text-xs flex items-center gap-1 italic">
                  {item.institution}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-2 border-white/30 h-15 w-15">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {item.name[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const { data: testimonials, isLoading } = usePublishedTestimonials();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const items = testimonials || [];
  const total = items.length;

  // Breakpoint-based: mobile=1, tablet(md)=2, desktop(lg)=3
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1;
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  };
  const visibleCount = getVisibleCount();

  const maxIndex = Math.max(0, total - visibleCount);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const measure = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (total <= visibleCount || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [total, visibleCount, isPaused, next]);

  useEffect(() => {
    if (current > maxIndex) setCurrent(maxIndex);
  }, [current, maxIndex]);

  // Each slide step = (containerWidth + GAP) / visibleCount
  const GAP = 16;
  const translateX =
    sliderWidth > 0 ? (current * (sliderWidth + GAP)) / visibleCount : 0;

  const dotCount = maxIndex + 1;

  const sectionStyle = {
    backgroundImage: "url(/bg-testimoni.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (isLoading) {
    return (
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto" />
            <div className="h-40 bg-slate-100 rounded-2xl mt-8" />
          </div>
        </div>
      </section>
    );
  }

  if (total === 0) return null;

  return (
    <section
      className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full"
      style={sectionStyle}
    >
      <div className="max-w-7xl mx-auto text-center place-items-center">
        <p className="bg-brand-mint w-fit text-xs text-brand-dark px-4 rounded-full py-1 font-semibold">
          Sepatah Kata
        </p>
        <div className="flex gap-3 items-baseline-last">
          <h1 className="text-[28px] md:text-[52px] text-white font-semibold mb-8">
            Dari Mereka
          </h1>
          <div className="h-5 w-5 bg-brand-steel"></div>
        </div>

        <div
          ref={sliderRef}
          className="relative overflow-hidden w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]"
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>

          {total > visibleCount && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-white" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: dotCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === current
                        ? "w-8 h-2.5 bg-white"
                        : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
