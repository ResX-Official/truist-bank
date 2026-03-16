"use client";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const ref = useScrollReveal();
  const t = useTranslations("landing.pricing");

  const PLANS = [
    {
      name: t("starterName"),
      price: { monthly: 0, annual: 0 },
      desc: t("starterDesc"),
      color: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.08)",
      highlight: false,
      cta: t("getStarted"),
      features: [
        { text: "1 checking account", included: true },
        { text: "Physical + virtual Truist card", included: true },
        { text: "$2,500/mo transfer limit", included: true },
        { text: "Basic spending insights", included: true },
        { text: "Standard support (48h)", included: true },
        { text: "Investment portfolio", included: false },
        { text: "Cash-back rewards", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: t("premiumName"),
      price: { monthly: 9.99, annual: 7.99 },
      desc: t("premiumDesc"),
      color: "rgba(72,149,239,0.08)",
      border: "rgba(72,149,239,0.3)",
      highlight: true,
      cta: t("startPremium"),
      features: [
        { text: "5 accounts (checking + savings)", included: true },
        { text: "Metal Truist card (worldwide)", included: true },
        { text: "$50,000/mo transfer limit", included: true },
        { text: "AI-powered spending insights", included: true },
        { text: "Priority support (2h)", included: true },
        { text: "Stocks, ETFs, crypto portfolio", included: true },
        { text: "Up to 2% cash-back rewards", included: true },
        { text: "Dedicated account manager", included: false },
      ],
    },
    {
      name: t("businessName"),
      price: { monthly: 29.99, annual: 24.99 },
      desc: t("businessDesc"),
      color: "rgba(255,255,255,0.03)",
      border: "rgba(255,255,255,0.08)",
      highlight: false,
      cta: t("talkToSales"),
      features: [
        { text: "Unlimited accounts", included: true },
        { text: "Team cards (up to 20)", included: true },
        { text: "Unlimited transfers + FX", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Priority support + SLA", included: true },
        { text: "Full investment suite + ETFs", included: true },
        { text: "Up to 3% cash-back", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(27,95,190,0.06) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Pricing</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg max-w-[520px] mx-auto leading-relaxed mb-8">
            {t("subtitle")}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-white" : "text-white/40"}`}>{t("monthly")}</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full transition-all duration-300"
              style={{ background: annual ? "linear-gradient(135deg,#1B5FBE,#4895EF)" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{ left: annual ? "calc(100% - 20px)" : "4px" }}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 transition-colors ${annual ? "text-white" : "text-white/40"}`}>
              {t("annually")}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold border border-green-500/20">
                {t("save")}
              </span>
            </span>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`section-reveal reveal-delay-${i + 1} relative rounded-2xl p-8 flex flex-col feature-card`}
              style={{
                background: plan.color,
                border: `1px solid ${plan.border}`,
                boxShadow: plan.highlight ? "0 0 50px rgba(72,149,239,0.15), 0 20px 40px rgba(0,0,0,0.3)" : undefined,
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div
                    className="px-4 py-1 rounded-full text-white text-xs font-bold font-sora tracking-wider"
                    style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}
                  >
                    {t("mostPopular").toUpperCase()}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-sora font-bold text-xl text-white mb-1">{plan.name}</h3>
                <p className="text-white/40 text-sm">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                {plan.price.monthly === 0 ? (
                  <div className="font-sora font-extrabold text-5xl text-white">{t("free")}</div>
                ) : (
                  <div className="flex items-end gap-1">
                    <div className="font-sora font-extrabold text-5xl text-white">
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </div>
                    <div className="text-white/40 text-sm mb-2">/month</div>
                  </div>
                )}
                {annual && plan.price.monthly > 0 && (
                  <div className="text-white/30 text-xs mt-1 line-through">${plan.price.monthly}/mo billed monthly</div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: feat.included ? "rgba(72,149,239,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${feat.included ? "rgba(72,149,239,0.3)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      {feat.included ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="#4895EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M2 2L6 6M6 2L2 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${feat.included ? "text-white/70" : "text-white/25 line-through"}`}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.highlight ? (
                <a href="#" className="btn-primary py-3.5 rounded-full font-sora font-semibold text-sm text-center">
                  {plan.cta}
                </a>
              ) : (
                <a
                  href="#"
                  className="py-3.5 rounded-full font-sora font-semibold text-sm text-center text-white/70 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "transparent" }}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/25 text-sm mt-10 section-reveal reveal-delay-4">
          All plans include FDIC insurance, 256-bit encryption, and zero hidden fees.
        </p>
      </div>
    </section>
  );
}
