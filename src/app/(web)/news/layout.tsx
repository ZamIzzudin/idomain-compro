import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates - iDomain",
  description:
    "Baca berita terbaru, pengumuman, dan update dari iDomain. Tetap up to date dengan kegiatan organisasi.",
  alternates: { canonical: "/news" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
