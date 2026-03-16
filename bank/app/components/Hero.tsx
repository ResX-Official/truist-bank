"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const AVATARS = [
  { initials: "AM", bg: "linear-gradient(135deg,#1B5FBE,#4895EF)" },
  { initials: "JR", bg: "linear-gradient(135deg,#6C3FC5,#9C72E8)" },
  { initials: "SK", bg: "linear-gradient(135deg,#0E9A63,#3ECFA0)" },
  { initials: "PL", bg: "linear-gradient(135deg,#C45121,#F48C5A)" },
];

export default function Hero() {
  const t = useTranslations("landing.hero");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 18}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Background ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid" />

      {/* Gradient blobs */}
      <div
        className="absolute w-[700px] h-[700px] -top-56 -left-56 rounded-full animate-blob"
        style={{ background: "radial-gradient(circle, rgba(72,149,239,0.11) 0%, transparent 70%)" }}
      />
      <div
        className="absolute w-[550px] h-[550px] top-1/4 -right-40 rounded-full animate-blob-2"
        style={{ background: "radial-gradient(circle, rgba(27,95,190,0.13) 0%, transparent 70%)" }}
      />
      <div
        className="absolute w-[400px] h-[400px] bottom-0 left-1/3 rounded-full animate-blob-3"
        style={{ background: "radial-gradient(circle, rgba(72,149,239,0.07) 0%, transparent 70%)" }}
      />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* Left: Text */}
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="badge glass-blue text-blue-light mb-8 w-fit">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "#4895EF", boxShadow: "0 0 8px #4895EF", animation: "pulseGlow 2s ease-in-out infinite" }}
            />
            <span>{t("badge")}</span>
          </div>

          {/* Headline */}
          <h1 className="font-sora font-extrabold leading-[1.05] tracking-tight mb-6 text-[3.2rem] sm:text-[4rem] lg:text-[5rem]">
            {t("title")}<br />
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-[460px]">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#"
              className="btn-primary px-8 py-4 rounded-full font-sora font-semibold text-[0.95rem] gap-2"
            >
              {t("cta")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#features"
              className="glass px-8 py-4 rounded-full font-sora font-semibold text-[0.95rem] text-white/65 hover:text-white transition-all duration-300 hover:border-blue/30"
            >
              {t("ctaSecondary")}
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-5">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#0E0E10] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: a.bg, zIndex: AVATARS.length - i }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">2.5M+ happy customers</div>
              <div className="text-white/40 text-xs mt-0.5">
                <span className="text-yellow-400">★★★★★</span> 4.9 / 5 average rating
              </div>
            </div>
          </div>
        </div>

        {/* Right: Card visual */}
        <div className="relative flex items-center justify-center h-[480px]">
          {/* Blue glow behind card */}
          <div
            className="absolute w-80 h-52 rounded-full blur-3xl animate-pulse-glow"
            style={{ background: "rgba(72,149,239,0.18)" }}
          />

          {/* Main bank card */}
          <div ref={cardRef} className="card-3d relative z-10 animate-float cursor-pointer">
            <div
              className="w-[320px] sm:w-[370px] h-[205px] sm:h-[225px] rounded-[22px] p-7 relative overflow-hidden glow-blue"
              style={{
                background: "linear-gradient(135deg, #091525 0%, #1B3A6B 32%, #0d2240 62%, #152f5c 100%)",
              }}
            >
              {/* Holographic sheen */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 32%, rgba(72,149,239,0.18) 46%, rgba(116,185,255,0.12) 54%, transparent 65%)",
                }}
              />
              {/* Top-right glow */}
              <div
                className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl pointer-events-none"
                style={{ background: "rgba(72,149,239,0.22)" }}
              />

              {/* Logo + Chip */}
              <div className="flex justify-between items-start mb-5">
                <span className="font-sora font-bold text-xl text-white tracking-widest">TRUIST</span>
                {/* Chip */}
                <div
                  className="relative w-11 h-8 rounded overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #C8971F 0%, #FFD700 40%, #B8860B 70%, #E5C100 100%)",
                  }}
                >
                  <div className="absolute top-[33%] left-0 right-0 h-px bg-black/25" />
                  <div className="absolute top-[66%] left-0 right-0 h-px bg-black/25" />
                  <div className="absolute left-[33%] top-0 bottom-0 w-px bg-black/25" />
                  <div className="absolute left-[66%] top-0 bottom-0 w-px bg-black/25" />
                  <div className="absolute inset-[30%] rounded-sm bg-black/10" />
                </div>
              </div>

              {/* Card number */}
              <div className="flex gap-5 mb-5 font-mono tracking-[0.18em] text-[0.8rem] text-white/65">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span className="text-white">4829</span>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-white/35 text-[0.62rem] uppercase tracking-widest mb-0.5">
                    Card Holder
                  </div>
                  <div className="text-white text-sm font-medium tracking-wider">ALEX MORGAN</div>
                </div>
                <div>
                  <div className="text-white/35 text-[0.62rem] uppercase tracking-widest mb-0.5">
                    Expires
                  </div>
                  <div className="text-white text-sm font-medium">09/28</div>
                </div>
                {/* Mastercard circles */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full -mr-3 opacity-90" style={{ background: "#EB001B" }} />
                  <div className="w-8 h-8 rounded-full opacity-90" style={{ background: "#F79E1B" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating: Payment received */}
          <div
            className="absolute top-8 -right-4 sm:right-4 glass rounded-2xl px-4 py-3 animate-float-alt z-20 min-w-[160px]"
            style={{ animationDelay: "1s" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(34,197,94,0.14)" }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 6.5L4.5 9.5L11 3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-white/45 text-[11px]">Payment Received</div>
                <div className="text-white font-semibold text-sm">+$2,540.00</div>
              </div>
            </div>
          </div>

          {/* Floating: Total balance */}
          <div
            className="absolute bottom-10 -left-4 sm:left-4 glass rounded-2xl px-4 py-3 animate-float z-20"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-white/40 text-[11px] mb-1">Total Balance</div>
            <div className="text-white font-bold text-lg leading-tight">$124,890.50</div>
            <div className="flex items-center gap-1 mt-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 7L5 3L8 7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-green-400 text-[11px] font-medium">+12.5% this month</span>
            </div>
          </div>

          {/* Floating: Savings progress */}
          <div
            className="absolute bottom-2 right-2 sm:right-8 glass rounded-2xl px-4 py-3 animate-float-alt z-20"
            style={{ animationDelay: "2.2s" }}
          >
            <div className="text-white/40 text-[11px] mb-2">Savings Goal</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full w-3/4"
                  style={{ background: "linear-gradient(90deg, #1B5FBE, #4895EF, #74B9FF)" }}
                />
              </div>
              <span className="text-blue-light text-[11px] font-semibold">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
        <span className="text-[10px] tracking-[0.22em] uppercase">Scroll</span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: "linear-gradient(180deg, rgba(72,149,239,0.6) 0%, transparent 100%)" }}
        />
      </div>
    </section>
  );
}
