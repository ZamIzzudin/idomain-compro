"use client";

import Container from "@/components/atomic/container";
import { BreadcrumbJsonLd } from "@/components/atomic/json-ld";
import AnimateOnScroll from "@/components/atomic/animate-on-scroll";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";
import { parseImageUrl } from "@/services/setting/service";

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

export default function ContactPage() {
  const { data: settings } = useSiteSettings();

  const phone = settings?.contact_phone || "";
  const email = settings?.contact_email || "";
  const address = settings?.contact_address || "";

  let socialLinks: { label: string; href: string; icon: string; customIconUrl?: string }[] = [];

  const socialLinksRaw = settings?.social_links;
  if (socialLinksRaw) {
    try {
      const parsed = JSON.parse(socialLinksRaw);
      if (Array.isArray(parsed)) {
        socialLinks = parsed.filter((s: SocialLinkItem) => s.url).map((s: SocialLinkItem) => ({ label: s.label, href: s.url, icon: s.icon, customIconUrl: s.customIconUrl }));
      }
    } catch { /* ignore */ }
  }

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
    <Container>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Beranda", path: "/" },
          { name: "Kontak", path: "/contact" },
        ]}
      />
      {/* Hero */}
      <section className="bg-brand-steel text-white py-24 md:py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4">
            Hubungi Kami
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - Contact Info */}
            <AnimateOnScroll variant="slide-left" className="lg:col-span-2">
              <div className="bg-brand-steel rounded-2xl p-6 md:p-8 h-full flex flex-col">
                <div className="flex gap-3 mb-8">
                  <div className="h-3 w-3 bg-brand-mint"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Informasi Kontak
                  </h2>
                </div>

                <div className="space-y-6 flex-1">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-brand-mint transition-colors shrink-0">
                        <Phone
                          size={18}
                          className="text-white group-hover:text-brand-dark transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Telepon</p>
                        <p className="text-white font-medium text-sm">
                          {phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-brand-mint transition-colors shrink-0">
                        <Mail
                          size={18}
                          className="text-white group-hover:text-brand-dark transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Email</p>
                        <p className="text-white font-medium text-sm">
                          {email}
                        </p>
                      </div>
                    </a>
                  )}

                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Alamat</p>
                        <p className="text-white font-medium text-sm">
                          {address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {socialLinks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex gap-3">
                      {socialLinks.map((socmed, idx) => {
                        const Icon = socialIconMap[socmed.icon];
                        return (
                          <a
                            key={idx}
                            href={socmed.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-mint transition-colors group"
                            aria-label={socmed.label}
                          >
                            {socmed.customIconUrl && socmed.icon === "custom" ? (
                              <img src={parseImageUrl(socmed.customIconUrl)} alt={socmed.label} className="w-4 h-4 object-contain" />
                            ) : Icon ? (
                              <Icon
                                size={16}
                                className="text-white group-hover:text-brand-dark transition-colors"
                              />
                            ) : (
                              <Globe size={16} className="text-white" />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>

            {/* Right - Contact Form */}
            <AnimateOnScroll variant="slide-right" className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex gap-3 mb-8 justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-steel">
                    Memiliki Pertanyaan?
                  </h2>
                </div>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama
                      </label>
                      <input
                        type="text"
                        placeholder="Nama lengkap"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subjek
                    </label>
                    <input
                      type="text"
                      placeholder="Subjek pesan"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Pesan
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tulis pesan Anda..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-colors text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer bg-brand-steel hover:bg-brand-steel/70 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </Container>
  );
}
