import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak - iDomain",
  description:
    "Hubungi tim iDomain untuk pertanyaan, kerja sama, atau informasi lebih lanjut. Temukan kontak dan media sosial kami.",
  alternates: { canonical: "/contact" },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
