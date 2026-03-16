"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  nl: "Nederlands",
  pl: "Polski",
  sv: "Svenska",
  da: "Dansk",
  no: "Norsk",
  fi: "Suomi",
  he: "עברית",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  ro: "Română",
  uk: "Українська",
  cs: "Čeština",
  hu: "Magyar",
  el: "Ελληνικά",
  bn: "বাংলা",
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
        style={{
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Globe size={12} />
        <span>{currentLocale.toUpperCase()}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-52 rounded-xl py-1.5 z-50 max-h-72 overflow-y-auto"
          style={{
            background: "#161620",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/[0.05] transition-colors"
              style={{ color: locale === currentLocale ? "#74B9FF" : "rgba(255,255,255,0.6)" }}
            >
              <span>{LOCALE_NAMES[locale]}</span>
              {locale === currentLocale && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
