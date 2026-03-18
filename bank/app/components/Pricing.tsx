"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Wallet, CreditCard, Send, BarChart3, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "150K+", label: "Active Members" },
  { value: "$2.4B", label: "Transferred" },
  { value: "30", label: "Languages" },
  { value: "99.9%", label: "Uptime" },
];

const INCLUDED = [
  { icon: Wallet, label: "4 Account Types", sub: "Checking, savings, investment & business" },
  { icon: CreditCard, label: "Virtual & Physical Cards", sub: "Issue and manage cards instantly" },
  { icon: Send, label: "Real-Time P2P Transfers", sub: "Send to any user by email address" },
  { icon: BarChart3, label: "Investment Tracking", sub: "Monitor your full portfolio performance" },
  { icon: Globe, label: "30 Languages", sub: "Full multi-language interface support" },
  { icon: ShieldCheck, label: "256-bit Encryption", sub: "Bank-grade security on every request" },
];

export default function Pricing() {
  const ref = useScrollReveal();

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(72,149,239,0.07) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Free Forever</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            No subscriptions.
            <br />
            <span className="gradient-text">All features included.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-[500px] mx-auto leading-relaxed">
            Every Trust Bank account comes with the full feature suite — no tiers, no hidden fees, no surprises.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 section-reveal reveal-delay-1">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center rounded-2xl py-7 px-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="font-sora font-extrabold text-3xl text-white mb-1">{s.value}</div>
              <div className="text-white/40 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Included features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14 section-reveal reveal-delay-2">
          {INCLUDED.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl feature-card"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}
                >
                  <Icon size={17} className="text-blue-light" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">{item.label}</div>
                  <div className="text-white/40 text-sm">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center section-reveal reveal-delay-3">
          <Link
            href="/en/register"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-sora font-semibold text-sm"
          >
            Open Your Free Account
            <ArrowRight size={15} />
          </Link>
          <p className="text-white/25 text-xs mt-4">No credit card required. Takes under 2 minutes.</p>
        </div>
      </div>
    </section>
  );
}
