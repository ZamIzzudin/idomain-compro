import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - iDomain",
  description:
    "Pelajari lebih lanjut tentang iDomain, visi, misi, dan komitmen kami dalam membangun jejaring alumni yang kuat.",
  alternates: { canonical: "/about" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
