/** @format */
"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Alumni", href: "/alumni" },
  { label: "News & Updates", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Kontak", href: "/contact" },
];

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

const sectionStyle = {
  backgroundImage: "url(/bg-footer.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Footer() {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || "IDOMAIN";
  const siteLogo = settings?.site_logo;
  const siteDesc =
    settings?.site_description ||
    "Website resmi organisasi yang berkomitmen untuk memperkuat jejaring dan berkontribusi bagi masyarakat melalui berbagai kegiatan.";
  const phone = settings?.contact_phone || "";
  const email = settings?.contact_email || "";
  const address = settings?.contact_address || "";

  const socialLinks = [
    { key: "facebook", label: "Facebook", href: settings?.social_facebook },
    { key: "instagram", label: "Instagram", href: settings?.social_instagram },
    { key: "youtube", label: "YouTube", href: settings?.social_youtube },
    { key: "linkedin", label: "LinkedIn", href: settings?.social_linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="bg-brand-dark text-white" style={sectionStyle}>
      <div className="px-[5%] md:px-[7%] lg:px-[10%] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            {siteLogo ? (
              <Link href="/">
                <img
                  src={siteLogo}
                  alt={siteName}
                  className="h-30 w-auto mb-5"
                />
              </Link>
            ) : (
              <>
                <h3 className="text-2xl font-bold">{siteName}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {siteDesc}
                </p>
              </>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((socmed) => {
                  const Icon = socialIcons[socmed.key];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={socmed.key}
                      href={socmed.href!}
                      target="_blank"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label={socmed.label}
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigasi</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hubungi Kami</h4>
            <ul className="space-y-4">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    <Mail size={16} />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={16} />
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li>
                  <a
                    href="#"
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{address}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Extra */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Informasi</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Kunjungi media sosial kami untuk informasi terbaru dan kegiatan
              yang akan datang.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <div className="px-[5%] md:px-[7%] lg:px-[10%] py-2">
          <p className="text-center text-xs text-brand-mint">
            &copy; {new Date().getFullYear()} {siteName} - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
