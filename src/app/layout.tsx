/** @format */

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/styles/globals.css";
import ClientLayout from "@/components/atomic/client-layout";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://idomain.example.com";

export const metadata: Metadata = {
  title: "IDOMAIN",
  description: "Website Resmi IDOMAIN",
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IDOMAIN",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
