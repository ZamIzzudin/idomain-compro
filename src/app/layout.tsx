/** @format */

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/styles/globals.css";
import ClientLayout from "@/components/atomic/client-layout";
import { SiteJsonLd } from "@/components/atomic/json-ld";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://idomain.example.com";

export const metadata: Metadata = {
  title: "iDomain",
  description: "Website Resmi iDomain",
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iDomain",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "iDomain",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#135292",
};

const Font = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={Font.className}>
      <body>
        <SiteJsonLd />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
