/** @format */

"use client";

import Container from "@/components/atomic/container";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";

export default function ContactPage() {
  const { data: settings } = useSiteSettings();

  const phone = settings?.contact_phone || "";
  const email = settings?.contact_email || "";
  const address = settings?.contact_address || "";

  return (
    <Container>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4">
            Hubungi Kami
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Ada pertanyaan? Jangan ragu untuk menghubungi kami
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-16 md:py-24 w-full">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Informasi Kontak
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami selalu terbuka untuk berdiskusi dan berkolaborasi. Hubungi
                kami melalui salah satu saluran berikut.
              </p>
            </div>

            <div className="space-y-5">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-brand-dark/10 rounded-xl flex items-center justify-center group-hover:bg-brand-dark transition-colors">
                    <Phone
                      size={20}
                      className="text-brand-dark group-hover:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-semibold text-gray-900">{phone}</p>
                  </div>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-brand-dark/10 rounded-xl flex items-center justify-center group-hover:bg-brand-dark transition-colors">
                    <Mail
                      size={20}
                      className="text-brand-dark group-hover:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{email}</p>
                  </div>
                </a>
              )}

              {address && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-dark/10 rounded-xl flex items-center justify-center">
                    <MapPin size={20} className="text-brand-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-semibold text-gray-900">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjek
                </label>
                <input
                  type="text"
                  placeholder="Subjek pesan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  placeholder="Tulis pesan Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none transition-colors text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-dark hover:bg-brand-dark-hover text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
    </Container>
  );
}
