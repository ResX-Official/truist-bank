"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Layers, ArrowLeftRight, BarChart3, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Layers,
    title: "Multiple Account Types",
    desc: "Checking, savings, investment, and business accounts — all managed from one dashboard.",
  },
  {
    icon: ArrowLeftRight,
    title: "Secure P2P Transfers",
    desc: "Send money to anyone instantly using just their email address.",
  },
  {
    icon: BarChart3,
    title: "Spending Insights",
    desc: "Full transaction history across all accounts with detailed breakdowns.",
  },
  {
    icon: CreditCard,
    title: "Virtual & Physical Cards",
    desc: "Issue, freeze, and manage your cards from anywhere, at any time.",
  },
];

const MINI_TXN = [
  { initials: "SA", bg: "linear-gradient(135deg,#1B5FBE,#4895EF)", name: "Salary", amount: "+$8,500", color: "#22C55E" },
  { initials: "NF", bg: "linear-gradient(135deg,#E50914,#B0060F)", name: "Netflix", amount: "-$15.99", color: "rgba(255,255,255,0.5)" },
  { initials: "SB", bg: "linear-gradient(135deg,#00704A,#00A67C)", name: "Starbucks", amount: "-$7.50", color: "rgba(255,255,255,0.5)" },
];

export default function AppShowcase() {
  const ref = useScrollReveal();

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at right center, rgba(72,149,239,0.07) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Feature list */}
        <div className="section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 w-fit">Dashboard</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
            Banking that fits
            <br />
            <span className="gradient-text">in your pocket</span>
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-[460px]">
            Truist Bank puts your full financial picture in one place — accounts, transfers, cards, and investments, available the moment you sign in.
          </p>

          <div className="space-y-5 mb-10">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}
                  >
                    <Icon size={17} className="text-blue-light" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{f.title}</div>
                    <div className="text-white/40 text-sm">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/en/register"
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-sora font-semibold text-sm"
            >
              Open Free Account
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/en/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-sora font-semibold text-sm text-white/70 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Sign In to Dashboard
            </Link>
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
                    {[3, 4, 5].map(h => <div key={h} className="w-0.5 rounded-sm bg-white/60" style={{ height: h }} />)}
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
                    <div className="font-sora font-bold text-white text-sm">Alex Morgan</div>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}
                  >AM</div>
                </div>

                {/* Balance card */}
                <div
                  className="rounded-2xl p-4 mb-4 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #091525, #1B3A6B, #0d2240)" }}
                >
                  <div className="text-white/50 text-[11px] mb-0.5">Total Balance</div>
                  <div className="font-sora font-bold text-white text-xl leading-tight">$24,850.50</div>
                  <div className="text-green-400 text-[11px] mt-1">+$1,250 this month</div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
                    style={{ background: "linear-gradient(90deg, transparent, #4895EF, transparent)" }}
                  />
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Send", icon: "↗" },
                    { label: "Receive", icon: "↙" },
                    { label: "Pay", icon: "+" },
                    { label: "More", icon: "···" },
                  ].map((a) => (
                    <div key={a.label} className="text-center">
                      <div
                        className="w-9 h-9 rounded-full mx-auto mb-1 flex items-center justify-center text-sm text-white/70"
                        style={{ background: "rgba(72,149,239,0.12)", border: "1px solid rgba(72,149,239,0.2)" }}
                      >
                        {a.icon}
                      </div>
                      <div className="text-white/40 text-[9px]">{a.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent */}
                <div className="text-[11px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Recent</div>
                {MINI_TXN.map((txn, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                        style={{ background: txn.bg }}
                      >{txn.initials}</div>
                      <span className="text-white text-[11px] font-medium">{txn.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: txn.color }}>{txn.amount}</span>
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div
                className="absolute bottom-0 left-0 right-0 flex justify-around py-3 px-3"
                style={{ background: "rgba(6,8,16,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <rect x="3" y="12" width="4" height="9" rx="1" stroke="white" strokeWidth="1.8" />
                  <rect x="10" y="7" width="4" height="14" rx="1" stroke="white" strokeWidth="1.8" />
                  <rect x="17" y="3" width="4" height="18" rx="1" stroke="white" strokeWidth="1.8" />
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8" />
                  <path d="M2 10h20" stroke="white" strokeWidth="1.8" />
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Floating badges */}
            <div
              className="absolute -left-10 top-1/4 glass rounded-xl px-3 py-2 animate-float-alt text-center"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-yellow-400 text-xs">★★★★★</div>
              <div className="text-white text-xs font-semibold mt-0.5">4.9 Rating</div>
            </div>
            <div
              className="absolute -right-8 bottom-1/3 glass rounded-xl px-3 py-2 animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="text-white/40 text-[10px]">Security</div>
              <div className="text-blue-light text-xs font-semibold">256-bit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
