"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

const SECURITY_ITEMS = [
  {
    title: "256-bit AES Encryption",
    desc: "Every byte of your data is encrypted using the same standard trusted by the world's largest financial institutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 11V7C8 4.791 9.791 3 12 3C14.209 3 16 4.791 16 7V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Biometric Authentication",
    desc: "Face ID, fingerprint, and hardware key support ensure only you can access your account.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 3C7 3 4 5 4 12C4 15.866 7.582 19 12 19C16.418 19 20 15.866 20 12C20 5 17 3 17 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 12C9 10.343 10.343 9 12 9C13.657 9 15 10.343 15 12C15 13.657 13.657 15 12 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Real-time Fraud Detection",
    desc: "AI monitors every transaction 24/7. Suspicious activity is flagged and blocked before it impacts you.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L20 7V12C20 16.418 16.418 20 12 21C7.582 20 4 16.418 4 12V7L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "FDIC Insured up to $250K",
    desc: "Your deposits are insured by the Federal Deposit Insurance Corporation — your money is always protected.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9H21M3 9V6L12 3L21 6V9M3 9V19H21V9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 13H15M12 13V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Zero-Knowledge Architecture",
    desc: "We can't read your private data. Our servers are architected so your secrets stay yours.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12C3 12 6 5 12 5C18 5 21 12 21 12C21 12 18 19 12 19C6 19 3 12 3 12Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "SOC 2 Type II Certified",
    desc: "Independently audited annually for security, availability, and confidentiality. Your trust, earned.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 3H20L22 9H2L4 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M3 9V21H21V9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 15H15M12 12V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Security() {
  const t = useTranslations("landing.security");
  const ref = useScrollReveal();

  return (
    <section id="security" className="relative py-24 overflow-hidden">
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(72,149,239,0.06) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Security First</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg max-w-[560px] mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Security grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECURITY_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`section-reveal reveal-delay-${(i % 3) + 1} feature-card glass-card rounded-2xl p-7`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-blue-light"
                style={{ background: "rgba(72,149,239,0.08)", border: "1px solid rgba(72,149,239,0.15)" }}
              >
                {item.icon}
              </div>
              <h3 className="font-sora font-bold text-base text-white mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badge row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 section-reveal reveal-delay-4">
          {["PCI DSS Level 1", "ISO 27001", "GDPR Compliant", "FDIC Insured", "SOC 2 Type II"].map((badge) => (
            <div
              key={badge}
              className="glass rounded-full px-5 py-2.5 text-white/50 text-xs font-semibold tracking-wider flex items-center gap-2"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 5.5L4 8L9.5 3" stroke="#4895EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
