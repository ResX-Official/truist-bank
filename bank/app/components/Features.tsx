"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 11H18M18 11L13 6M18 11L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6H8M4 16H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    title: "Instant Global Transfers",
    desc: "Send money to 180+ countries in seconds, not days. Real exchange rates with zero markups.",
    tag: "0 Fees",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3C11 3 5 6 5 11.5C5 14.538 7.686 17 11 17C14.314 17 17 14.538 17 11.5C17 6 11 3 11 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 11.5H14M11 8.5V14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "AI-Powered Savings",
    desc: "Intelligent algorithms analyze your spending and automatically grow your savings — effortlessly.",
    tag: "Smart AI",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="7" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 7V5C7 3.895 7.895 3 9 3H13C14.105 3 15 3.895 15 5V7" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="11" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Bank-Grade Security",
    desc: "256-bit encryption, biometric auth, and real-time fraud monitoring protect every transaction.",
    tag: "256-bit",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 8L11 3L19 8V14L11 19L3 14V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 8V11L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Smart Investments",
    desc: "Access diversified portfolios, ETFs, and crypto — all managed from one seamless dashboard.",
    tag: "Auto-Invest",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M11 7V11L14 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "24/7 Human Support",
    desc: "Reach a real person in under 60 seconds, day or night. No bots. No wait queues. Ever.",
    tag: "Always On",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 11H19M3 6H19M3 16H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 14.5V16L18 17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Detailed Analytics",
    desc: "Beautiful spending insights, budgets, and net-worth tracking — updated in real time.",
    tag: "Real-time",
  },
];

export default function Features() {
  const t = useTranslations("landing.features");
  const ref = useScrollReveal();

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(72,149,239,0.8) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Features</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg max-w-[560px] mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className={`section-reveal reveal-delay-${(i % 3) + 1} feature-card glass-card rounded-2xl p-7 group`}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-light transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.18)" }}
                >
                  {feat.icon}
                </div>
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider"
                  style={{
                    background: "rgba(72,149,239,0.1)",
                    border: "1px solid rgba(72,149,239,0.2)",
                    color: "#74B9FF",
                  }}
                >
                  {feat.tag}
                </span>
              </div>

              <h3 className="font-sora font-bold text-lg text-white mb-2 group-hover:text-blue-faint transition-colors duration-300">
                {feat.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">{feat.desc}</p>

              {/* Arrow indicator */}
              <div className="mt-5 flex items-center gap-1.5 text-blue/0 group-hover:text-blue-light transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                <span className="text-xs font-semibold">Learn more</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
