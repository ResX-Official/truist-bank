"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("landing.cta");
  const ref = useScrollReveal();

  return (
    <section className="relative py-24 overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden section-reveal"
          style={{
            background:
              "linear-gradient(135deg, #0d1f3c 0%, #1B3A6B 40%, #0a1525 70%, #162e58 100%)",
            border: "1px solid rgba(72,149,239,0.2)",
            boxShadow: "0 0 80px rgba(72,149,239,0.12), 0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Decorative corner glows */}
          <div
            className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl"
            style={{ background: "rgba(72,149,239,0.15)" }}
          />
          <div
            className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl"
            style={{ background: "rgba(27,95,190,0.18)" }}
          />

          {/* Spinning ring decoration */}
          <div
            className="absolute top-8 right-12 w-24 h-24 rounded-full animate-spin-slow opacity-20"
            style={{
              border: "1px solid rgba(72,149,239,0.8)",
              borderTopColor: "transparent",
            }}
          />
          <div
            className="absolute top-12 right-16 w-16 h-16 rounded-full animate-spin-slow opacity-10"
            style={{
              border: "1px solid rgba(116,185,255,0.8)",
              borderBottomColor: "transparent",
              animationDirection: "reverse",
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="relative z-10 px-8 sm:px-14 py-16 text-center">
            {/* Badge */}
            <div className="badge glass-blue text-blue-light mb-7 mx-auto w-fit">
              <span className="inline-block w-2 h-2 rounded-full bg-blue animate-pulse" />
              Limited Early Access
            </div>

            <h2 className="font-sora font-extrabold text-4xl lg:text-[3.2rem] tracking-tight leading-tight mb-5 text-white">
              <span className="shimmer-text">{t("title")}</span>
            </h2>

            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-[520px] mx-auto">
              {t("subtitle")}
            </p>

            {/* Email form */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full sm:flex-1 px-5 py-3.5 rounded-full text-sm bg-white/[0.07] border border-white/10 text-white placeholder-white/30 outline-none focus:border-blue/50 transition-colors"
              />
              <button className="btn-primary w-full sm:w-auto px-7 py-3.5 rounded-full font-sora font-semibold text-sm whitespace-nowrap">
                Get Early Access
              </button>
            </div>

            <p className="text-white/25 text-xs">
              No credit card required · Cancel anytime · FDIC insured
            </p>

            {/* Trust icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {[
                { icon: "🔒", label: "Bank-level security" },
                { icon: "⚡", label: "Instant setup" },
                { icon: "💳", label: "Free virtual card" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/35 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
