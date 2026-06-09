/** @format */
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/services/setting/hook";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Alumni", href: "/alumni" },
  {
    label: "News & Updates",
    href: "/news",
    children: [
      { label: "Press Release", href: "/news?category=press-release" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Kontak", href: "/contact" },
];

export default function Navbar() {
  const path = usePathname();
  const { data: settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const siteName = settings?.site_name || "IDOMAIN";
  const phone = settings?.contact_phone || "";
  const email = settings?.contact_email || "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Top Contact Bar */}
        {(phone || email) && (
          <div
            className={`bg-brand-dark text-white text-sm transition-all duration-300 ${
              isScrolled ? "hidden" : "block"
            }`}
          >
            <div className="flex justify-between items-center px-[5%] md:px-[5%] lg:px-[5%] py-2">
              <div className="flex items-center gap-6">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Phone size={14} />
                    <span className="hidden sm:inline">{phone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Mail size={14} />
                    <span className="hidden sm:inline">{email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div
          className={`flex justify-between text-white items-center transition-all duration-300 ${
            isScrolled
              ? "bg-brand-dark/70 shadow-lg px-[3%]"
              : "bg-gradient-to-b from-black to-transparent px-[5%] md:px-[7%] lg:px-[10%]"
          }`}
        >
          {/* Logo */}
          <Link href="/" onClick={closeSidebar} className="py-3">
            {settings?.site_logo ? (
              <div className="flex items-center gap-3">
                <img
                  src={settings.site_logo}
                  alt={siteName}
                  className={`w-auto ${isScrolled ? "h-8 md:h-10" : "h-8 md:h-20"}`}
                />
                <span
                  className={`text-xl md:text-xl font-bold tracking-wide ${
                    isScrolled ? "block" : "hidden"
                  }`}
                >
                  {siteName}
                </span>
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-bold tracking-wide">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-10 py-4 items-center text-sm">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`relative flex items-center gap-1 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-brand-mint after:transition-all after:duration-300 hover:after:w-full ${
                        path === link.href ? "text-white font-semibold" : ""
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 min-w-[200px] ${
                        activeDropdown === link.label
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-6 py-3 text-gray-800 hover:bg-brand-dark hover:text-white transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const isActive = path === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-brand-mint after:transition-all after:duration-300 ${
                    isActive
                      ? "font-semibold after:w-full"
                      : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden px-2 py-5 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`bg-white fixed top-0 left-0 h-full w-[280px] shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <Link href="/" onClick={closeSidebar}>
              {settings?.site_logo ? (
                <img
                  src={settings.site_logo}
                  alt={siteName}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-brand-dark">
                  {siteName}
                </span>
              )}
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-5">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className={`block px-6 py-3 transition-colors ${
                    path === link.href
                      ? "text-brand-dark bg-blue-50 border-l-4 border-brand-dark font-semibold"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="bg-gray-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block pl-12 pr-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-brand-dark transition-colors"
                        onClick={closeSidebar}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
