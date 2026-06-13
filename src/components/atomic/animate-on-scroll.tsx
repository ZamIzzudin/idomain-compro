"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "fade-up" | "fade-in" | "slide-left" | "slide-right" */
  variant?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
  once?: boolean;
}

const variants = {
  "fade-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
};

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const v = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
