import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni - iDomain",
  description:
    "Temukan dan terhubung dengan alumni iDomain. Jelajahi direktori alumni, sebaran geografis, dan statistik angkatan.",
  alternates: { canonical: "/alumni" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
