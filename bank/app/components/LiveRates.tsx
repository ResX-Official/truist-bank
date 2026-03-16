"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

const RATES = [
  { pair: "USD / EUR", rate: "0.9231", change: +0.12, flag1: "🇺🇸", flag2: "🇪🇺" },
  { pair: "USD / GBP", rate: "0.7894", change: -0.08, flag1: "🇺🇸", flag2: "🇬🇧" },
  { pair: "USD / JPY", rate: "149.82", change: +0.34, flag1: "🇺🇸", flag2: "🇯🇵" },
  { pair: "USD / CAD", rate: "1.3541", change: -0.05, flag1: "🇺🇸", flag2: "🇨🇦" },
  { pair: "USD / AUD", rate: "1.5420", change: +0.22, flag1: "🇺🇸", flag2: "🇦🇺" },
  { pair: "USD / CHF", rate: "0.8832", change: +0.07, flag1: "🇺🇸", flag2: "🇨🇭" },
  { pair: "USD / SGD", rate: "1.3380", change: -0.03, flag1: "🇺🇸", flag2: "🇸🇬" },
  { pair: "USD / INR", rate: "83.240", change: +0.18, flag1: "🇺🇸", flag2: "🇮🇳" },
];

export default function LiveRates() {
  const ref = useScrollReveal();
  const t = useTranslations("landing.liveRates");

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="line-gradient absolute top-0 left-0 right-0" />
      <div className="line-gradient absolute bottom-0 left-0 right-0" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 section-reveal">
          <div>
            <div className="badge glass-blue text-blue-light mb-3 w-fit">{t("badge")}</div>
            <h2 className="font-sora font-extrabold text-3xl lg:text-4xl tracking-tight">
              {t("title")} <span className="gradient-text">{t("titleHighlight")}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/50 text-sm">{t("liveLabel")}</span>
          </div>
        </div>

        {/* Rate grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RATES.map((r, i) => (
            <div
              key={r.pair}
              className={`section-reveal reveal-delay-${(i % 4) + 1} feature-card glass-card rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-lg">
                  <span>{r.flag1}</span>
                  <span className="text-white/20">→</span>
                  <span>{r.flag2}</span>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: r.change >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: r.change >= 0 ? "#22C55E" : "#EF4444",
                    border: `1px solid ${r.change >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {r.change >= 0 ? "+" : ""}{r.change}%
                </span>
              </div>
              <div className="text-white/40 text-xs mb-1 font-medium tracking-wider">{r.pair}</div>
              <div className="font-sora font-bold text-2xl text-white">{r.rate}</div>

              {/* Mini sparkline (decorative) */}
              <div className="mt-3">
                <svg width="100%" height="20" viewBox="0 0 120 20" fill="none" preserveAspectRatio="none">
                  <polyline
                    points={
                      r.change >= 0
                        ? "0,16 20,12 40,14 60,8 80,10 100,6 120,4"
                        : "0,4 20,8 40,6 60,12 80,10 100,14 120,16"
                    }
                    stroke={r.change >= 0 ? "#22C55E" : "#EF4444"}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-6 section-reveal reveal-delay-4">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
