import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iDomain - Website Resmi",
  description:
    "Selamat datang di iDomain. Jejaring alumni, berita terkini, lowongan karier, events, dan informasi kontak dalam satu platform.",
  alternates: { canonical: "/" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
