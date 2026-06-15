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
  Twitter,
  Globe,
} from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";
import { parseImageUrl } from "@/services/setting/service";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Alumni", href: "/alumni" },
  { label: "News & Updates", href: "/news" },
  { label: "Career", href: "/career" },
  { label: "Events", href: "/events" },
  { label: "Kontak", href: "/contact" },
];

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Globe,
  whatsapp: Globe,
  telegram: Globe,
  github: Globe,
  globe: Globe,
  mail: Mail,
  phone: Phone,
};

interface SocialLinkItem {
  label: string;
  url: string;
  icon: string;
  customIconUrl?: string;
}

const sectionStyle = {
  backgroundImage: "url(/bg-footer.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Footer() {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || "iDomain";
  const siteLogo = parseImageUrl(settings?.site_logo);
  const siteDesc =
    settings?.site_description ||
    "Website resmi organisasi yang berkomitmen untuk memperkuat jejaring dan berkontribusi bagi masyarakat melalui berbagai kegiatan.";
  const phone = settings?.contact_phone || "";
  const email = settings?.contact_email || "";
  const address = settings?.contact_address || "";

  let socialLinks: {
    label: string;
    href: string;
    icon: string;
    customIconUrl?: string;
  }[] = [];

  // Try new dynamic format first
  const socialLinksRaw = settings?.social_links;
  if (socialLinksRaw) {
    try {
      const parsed = JSON.parse(socialLinksRaw);
      if (Array.isArray(parsed)) {
        socialLinks = parsed
          .filter((s: SocialLinkItem) => s.url)
          .map((s: SocialLinkItem) => ({
            label: s.label,
            href: s.url,
            icon: s.icon,
            customIconUrl: s.customIconUrl,
          }));
      }
    } catch {
      /* ignore */
    }
  }

  // Fallback to legacy social_* fields
  if (socialLinks.length === 0) {
    const legacy = [
      { key: "social_facebook", label: "Facebook", icon: "facebook" },
      { key: "social_instagram", label: "Instagram", icon: "instagram" },
      { key: "social_youtube", label: "YouTube", icon: "youtube" },
      { key: "social_linkedin", label: "LinkedIn", icon: "linkedin" },
      { key: "social_twitter", label: "Twitter/X", icon: "twitter" },
    ];
    for (const s of legacy) {
      const val = settings?.[s.key as keyof typeof settings];
      if (val) {
        socialLinks.push({ label: s.label, href: val, icon: s.icon });
      }
    }
  }

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
                {socialLinks.map((socmed, idx) => {
                  const Icon = socialIconMap[socmed.icon];
                  return (
                    <Link
                      key={idx}
                      href={socmed.href}
                      target="_blank"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label={socmed.label}
                    >
                      {socmed.customIconUrl && socmed.icon === "custom" ? (
                        <img
                          src={parseImageUrl(socmed.customIconUrl)}
                          alt={socmed.label}
                          className="w-[18px] h-[18px] object-contain"
                        />
                      ) : Icon ? (
                        <Icon size={18} />
                      ) : (
                        <Globe size={18} />
                      )}
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
