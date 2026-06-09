/** @format */

"use client";

import Container from "@/components/atomic/container";
import Hero from "@/components/hero/hero";
import AboutSection from "@/components/about";
import TestimonialSection from "@/components/testimonial-slider";
import NewsSection from "@/components/newslist";
import CTASection from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <AboutSection />
        <TestimonialSection />
        <NewsSection />
        <CTASection />
      </Container>
    </>
  );
}
