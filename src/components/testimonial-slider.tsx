/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote, Building2 } from "lucide-react";
import { usePublishedTestimonials } from "@/services/testimonial/hook";

export default function TestimonialSection() {
  const { data: testimonials, isLoading } = usePublishedTestimonials();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = testimonials || [];
  const total = items.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [total, isPaused, next]);

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

  const item = items[current];

  return (
    <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full bg-gradient-to-br from-brand-dark to-brand-dark-hover">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-2">
          Apa Kata Mereka
        </h2>
        <p className="text-gray-300 text-base md:text-lg mb-12">
          Testimoni dari alumni dan anggota kami
        </p>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Quote Icon */}
          <Quote className="w-12 h-12 text-white/20 mx-auto mb-6" />

          {/* Testimonial Text */}
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-white text-lg md:text-xl leading-relaxed font-light italic max-w-3xl mx-auto">
              &ldquo;{item.testimonial}&rdquo;
            </p>
          </div>

          {/* Author */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-2 border-white/30">
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
            <p className="text-white font-semibold text-base">{item.name}</p>
            {item.institution && (
              <p className="text-gray-300 text-sm flex items-center gap-1">
                <Building2 size={14} />
                {item.institution}
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-white" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {items.map((_, idx) => (
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
