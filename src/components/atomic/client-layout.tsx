"use client";

import { Suspense, ReactNode } from "react";
import { TanstackProvider } from "@/lib/tanstack";
import Navbar from "./navbar";
import Footer from "./footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <TanstackProvider>
        <Navbar />
        {children}
        <Footer />
      </TanstackProvider>
    </Suspense>
  );
}
