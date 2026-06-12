"use client";

import { Suspense, ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { TanstackProvider } from "@/lib/tanstack";
import Navbar from "./navbar";
import Footer from "./footer";
import { useSiteSettings } from "@/services/setting/hook";

function FaviconSync() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings?.site_favicon) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = settings.site_favicon;
  }, [settings?.site_favicon]);

  return null;
}

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
        <FaviconSync />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              },
              iconTheme: {
                primary: "#22c55e",
                secondary: "#f0fdf4",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fef2f2",
              },
            },
          }}
        />
        <Navbar />
        {children}
        <Footer />
      </TanstackProvider>
    </Suspense>
  );
}
