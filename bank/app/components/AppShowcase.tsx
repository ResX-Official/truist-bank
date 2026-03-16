"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

// Fake mini transaction data inside the phone
const MINI_TXN = [
  { icon: "💼", name: "Salary", amount: "+$8,500", color: "#22C55E" },
  { icon: "🎬", name: "Netflix", amount: "-$15.99", color: "rgba(255,255,255,0.5)" },
  { icon: "☕", name: "Starbucks", amount: "-$7.50", color: "rgba(255,255,255,0.5)" },
];

export default function AppShowcase() {
  const ref = useScrollReveal();
  const t = useTranslations("landing.appShowcase");

  const APP_FEATURES = [
    { icon: "⚡", title: t("f1Title"), desc: t("f1Desc") },
    { icon: "🔐", title: t("f2Title"), desc: t("f2Desc") },
    { icon: "📊", title: t("f3Title"), desc: t("f3Desc") },
    { icon: "🌍", title: t("f4Title"), desc: t("f4Desc") },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at right center, rgba(72,149,239,0.07) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Feature list */}
        <div className="section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 w-fit">{t("badge")}</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
            {t("title")}
            <br />
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-[460px]">
            {t("subtitle")}
          </p>

          <div className="space-y-5 mb-10">
            {APP_FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">{f.title}</div>
                  <div className="text-white/40 text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* App store buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="flex items-center gap-3 glass rounded-xl px-5 py-3 hover:border-blue/30 transition-all duration-200 group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <div className="text-white/40 text-[10px]">{t("downloadOn")}</div>
                <div className="text-white font-semibold text-sm">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 glass rounded-xl px-5 py-3 hover:border-blue/30 transition-all duration-200 group"
            >
              <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
                <path d="M0.428 0.43C0.158 0.72 0 1.16 0 1.73V22.27C0 22.84 0.158 23.28 0.428 23.57L0.506 23.645L11.755 12.397V12.131V11.864L0.506 0.355L0.428 0.43Z" fill="#00C3F8" />
                <path d="M15.59 16.261L11.754 12.396V12.13V11.864L15.592 8L15.592 8.001L20.459 10.768C21.82 11.536 21.82 12.795 20.459 13.564L15.592 16.261H15.59Z" fill="#FFD500" />
                <path d="M15.592 16.261L11.755 12.396L0.428 23.569C0.866 24.04 1.583 24.098 2.39 23.641L15.592 16.261Z" fill="#F6383B" />
                <path d="M15.592 8.001L2.39 0.622C1.583 0.164 0.866 0.224 0.428 0.693L11.754 11.865L15.592 8.001Z" fill="#5CF375" />
              </svg>
              <div>
                <div className="text-white/40 text-[10px]">{t("getItOn")}</div>
                <div className="text-white font-semibold text-sm">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="flex items-center justify-center section-reveal reveal-delay-2">
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute -inset-6 rounded-full blur-3xl animate-pulse-glow"
              style={{ background: "radial-gradient(circle, rgba(72,149,239,0.15) 0%, transparent 70%)" }}
            />

            {/* Phone frame */}
            <div
              className="relative z-10 animate-float"
              style={{
                width: 265,
                height: 545,
                borderRadius: 44,
                border: "10px solid rgba(255,255,255,0.07)",
                background: "#060810",
                boxShadow: "0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Status bar */}
              <div className="flex justify-between items-center px-5 pt-3 text-[11px] text-white/50">
                <span>9:41</span>
                <div className="w-16 h-3.5 rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-2" />
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[3, 4, 5].map(h => <div key={h} className={`w-0.5 rounded-sm bg-white/60`} style={{ height: h }} />)}
                  </div>
                  <div className="w-4 h-2 rounded-sm border border-white/40 flex items-center pr-0.5">
                    <div className="w-2.5 h-1 bg-white/60 rounded-sm ml-0.5" />
                  </div>
                </div>
              </div>

              {/* App content */}
              <div className="px-4 pt-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white/40 text-[11px]">Good morning,</div>
                    <div className="font-sora font-bold text-white text-sm">Alex Morgan 👋</div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>AM</div>
                </div>

                {/* Balance card */}
                <div className="rounded-2xl p-4 mb-4 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #091525, #1B3A6B, #0d2240)" }}>
                  <div className="text-white/50 text-[11px] mb-0.5">Total Balance</div>
                  <div className="font-sora font-bold text-white text-xl leading-tight">$24,850.50</div>
                  <div className="text-green-400 text-[11px] mt-1">↑ +$1,250 this month</div>
                  {/* mini shimmer line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
                    style={{ background: "linear-gradient(90deg, transparent, #4895EF, transparent)" }} />
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Send", icon: "↗" },
                    { label: "Receive", icon: "↙" },
                    { label: "Pay", icon: "💳" },
                    { label: "More", icon: "⋯" },
                  ].map((a) => (
                    <div key={a.label} className="text-center">
                      <div className="w-9 h-9 rounded-full mx-auto mb-1 flex items-center justify-center text-sm text-white/70"
                        style={{ background: "rgba(72,149,239,0.12)", border: "1px solid rgba(72,149,239,0.2)" }}>
                        {a.icon}
                      </div>
                      <div className="text-white/40 text-[9px]">{a.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent */}
                <div className="text-[11px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Recent</div>
                {MINI_TXN.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        style={{ background: "rgba(72,149,239,0.1)" }}>{t.icon}</div>
                      <span className="text-white text-[11px] font-medium">{t.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: t.color }}>{t.amount}</span>
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2.5 px-3"
                style={{ background: "rgba(6,8,16,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {["🏠", "📊", "💳", "⚙️"].map((icon, i) => (
                  <div key={i} className={`text-base ${i === 0 ? "opacity-100" : "opacity-30"}`}>{icon}</div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-10 top-1/4 glass rounded-xl px-3 py-2 animate-float-alt text-center"
              style={{ animationDelay: "0.5s" }}>
              <div className="text-yellow-400 text-xs">★★★★★</div>
              <div className="text-white text-xs font-semibold mt-0.5">4.9 App Store</div>
            </div>
            <div className="absolute -right-8 bottom-1/3 glass rounded-xl px-3 py-2 animate-float"
              style={{ animationDelay: "1.5s" }}>
              <div className="text-white/40 text-[10px]">Security</div>
              <div className="text-blue-light text-xs font-semibold">256-bit ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
