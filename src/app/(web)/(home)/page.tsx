/** @format */

"use client";

import Container from "@/components/atomic/container";
import Hero from "@/components/hero/hero";
import AboutSection from "@/components/about";
import TestimonialSection from "@/components/testimonial-slider";
import EventSection from "@/components/eventlist";
import NewsSection from "@/components/newslist";
import CTASection from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <AboutSection />
        <NewsSection />
        <TestimonialSection />
        <EventSection />
        <CTASection />
      </Container>
    </>
  );
}
