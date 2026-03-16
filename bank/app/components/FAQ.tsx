"use client";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useScrollReveal();
  const t = useTranslations("landing.faq");

  const FAQS = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">FAQ</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`section-reveal reveal-delay-${(i % 4) + 1} rounded-2xl overflow-hidden transition-all duration-300`}
              style={{
                background: open === i ? "rgba(72,149,239,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${open === i ? "rgba(72,149,239,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-sora font-semibold text-white text-sm lg:text-base">{faq.q}</span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: open === i ? "rgba(72,149,239,0.2)" : "rgba(255,255,255,0.05)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2V10M2 6H10" stroke={open === i ? "#4895EF" : "rgba(255,255,255,0.5)"} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? "300px" : "0px" }}
              >
                <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
