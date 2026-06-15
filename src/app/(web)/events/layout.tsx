import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Programs - iDomain",
  description:
    "Jelajahi acara dan program mendatang dari iDomain. Temukan workshop, seminar, dan kegiatan alumni lainnya.",
  alternates: { canonical: "/events" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
