"use client";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { useParams } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("landing.nav");

  const NAV_LINKS = [
    { label: t("features"), href: "#features" },
    { label: t("security"), href: "#security" },
    { label: t("pricing"), href: "#pricing" },
    { label: t("about"), href: "#about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: "linear-gradient(135deg, #1B5FBE, #4895EF)" }}
          >
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-sora font-bold text-lg text-white">
            Truist Bank
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/50 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <a
            href={`/${locale}/login`}
            className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium"
          >
            {t("signIn")}
          </a>
          <a
            href={`/${locale}/register`}
            className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold font-sora"
          >
            {t("getStarted")}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 glass border-t border-white/[0.06] ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/60 hover:text-white text-base font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="flex justify-center">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <a href={`/${locale}/login`} className="text-white/60 hover:text-white text-sm transition-colors text-center">
              {t("signIn")}
            </a>
            <a href={`/${locale}/register`} className="btn-primary py-3 rounded-full text-sm font-semibold font-sora text-center">
              {t("getStarted")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
