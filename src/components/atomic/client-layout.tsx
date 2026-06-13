"use client";

import { Suspense, ReactNode, useEffect, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { TanstackProvider } from "@/lib/tanstack";
import AxiosClient from "@/lib/axios";
import { clearToken } from "@/lib/auth";
import Navbar from "./navbar";
import Footer from "./footer";
import SplashScreen from "@/components/SplashScreen";
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

function AuthGuard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    AxiosClient.setOnAuthExpired(() => {
      clearToken();
      queryClient.removeQueries({ queryKey: ["alumni_me"] });
      queryClient.removeQueries({ queryKey: ["my_work_histories"] });
    });
  }, [queryClient]);

  return null;
}

const SPLASH_KEY = "splash_shown";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem(SPLASH_KEY);
    if (!shown) {
      setShowSplash(true);
    }
    setMounted(true);
  }, []);

  const handleSplashFinished = useCallback(() => {
    sessionStorage.setItem(SPLASH_KEY, "1");
    setShowSplash(false);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <TanstackProvider>
        <AuthGuard />
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
        {mounted && showSplash && <SplashScreen onFinished={handleSplashFinished} />}
        <Navbar />
        {children}
        <Footer />
      </TanstackProvider>
    </Suspense>
  );
}
