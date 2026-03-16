"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const ref = useScrollReveal();
  const t = useTranslations("landing.howItWorks");

  const STEPS = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 21C5 17.134 8.582 14 13 14C17.418 14 21 17.134 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="3" y="8" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12H23" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 16H10M14 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 5L13 2L17 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="8" y="2" width="10" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 6L14 8L18 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at right center, rgba(27,95,190,0.06) 0%, transparent 70%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">How It Works</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg max-w-[520px] mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Connecting lines (desktop) */}
          <div className="hidden lg:block absolute top-[72px] left-[33%] right-[33%] h-px" style={{ background: "linear-gradient(90deg, rgba(72,149,239,0.3), rgba(72,149,239,0.05))" }} />
          <div className="hidden lg:block absolute top-[72px] left-[66%] right-0 h-px" style={{ background: "linear-gradient(90deg, rgba(72,149,239,0.05), rgba(72,149,239,0.3))" }} />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`section-reveal reveal-delay-${i + 1} flex flex-col items-center text-center`}
            >
              {/* Number badge + Icon */}
              <div className="relative mb-8">
                {/* Outer ring */}
                <div
                  className="w-[100px] h-[100px] rounded-full flex items-center justify-center animate-spin-slow"
                  style={{
                    background: "conic-gradient(rgba(72,149,239,0.4) 0%, rgba(72,149,239,0.05) 40%, transparent 60%)",
                  }}
                />
                {/* Inner circle */}
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center text-blue-light"
                  style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.2)" }}
                >
                  {step.icon}
                </div>
                {/* Step number */}
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-sora font-bold text-xs text-white"
                  style={{ background: "linear-gradient(135deg, #1B5FBE, #4895EF)" }}
                >
                  {i + 1}
                </div>
              </div>

              <h3 className="font-sora font-bold text-xl text-white mb-3">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-[280px]">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA beneath steps */}
        <div className="text-center mt-16 section-reveal reveal-delay-4">
          <a
            href="#"
            className="btn-primary px-10 py-4 rounded-full font-sora font-semibold text-base gap-2"
          >
            Start for Free Today
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="text-white/30 text-sm mt-4">No credit card required · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
