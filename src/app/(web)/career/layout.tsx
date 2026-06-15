import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career - iDomain",
  description:
    "Temukan lowongan kerja dan peluang karier dari iDomain dan mitra. Cari berdasarkan kategori, lokasi, dan jenis pekerjaan.",
  alternates: { canonical: "/career" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
