"use client";
import { useEffect, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function CardShowcase() {
  const t = useTranslations("landing.cardShowcase");

  const PERKS = [
    { text: t("p1Text"), sub: t("p1Sub") },
    { text: t("p2Text"), sub: t("p2Sub") },
    { text: t("p3Text"), sub: t("p3Sub") },
    { text: t("p4Text"), sub: t("p4Sub") },
    { text: t("p5Text"), sub: t("p5Sub") },
  ];
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useScrollReveal();


  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 20}deg) rotateX(${-y * 14}deg)`;
    };
    const handleLeave = () => { card.style.transform = "perspective(900px) rotateY(-8deg) rotateX(4deg)"; };
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => { card.removeEventListener("mousemove", handleMove); card.removeEventListener("mouseleave", handleLeave); };
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ambient gradient */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(72,149,239,0.07) 0%, transparent 70%)" }}
      />

      <div ref={revealRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Card visual */}
        <div className="flex items-center justify-center section-reveal">
          <div className="relative">
            {/* Stacked glow layers */}
            <div
              className="absolute -inset-8 rounded-3xl blur-3xl animate-pulse-glow"
              style={{ background: "radial-gradient(ellipse, rgba(72,149,239,0.18) 0%, transparent 70%)" }}
            />

            {/* Black card (back) */}
            <div
              className="absolute top-6 left-4 w-[340px] h-[210px] rounded-2xl opacity-40"
              style={{
                background: "linear-gradient(135deg, #060d18, #0d1e38)",
                transform: "rotate(-3deg)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />

            {/* Main card */}
            <div
              ref={cardRef}
              className="card-3d relative z-10 cursor-pointer"
              style={{ transform: "perspective(900px) rotateY(-8deg) rotateX(4deg)", transition: "transform 0.15s ease" }}
            >
              <div
                className="w-[340px] h-[210px] rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0E0E10 0%, #1a1f35 30%, #0a0e1a 60%, #111624 100%)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(72,149,239,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Subtle shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(72,149,239,0.06) 45%, rgba(255,255,255,0.04) 55%, transparent 65%)",
                  }}
                />
                {/* Edge highlight */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ border: "1px solid rgba(72,149,239,0.15)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
                />

                {/* NFC + Logo */}
                <div className="flex justify-between items-start mb-6">
                  <span className="font-sora font-bold text-xl text-white tracking-widest">TRUIST</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C12 2 5 6 5 12C5 15.314 8.134 18 12 18C15.866 18 19 15.314 19 12C19 6 12 2 12 2Z" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M12 6C12 6 8 8.5 8 12C8 13.657 9.791 15 12 15C14.209 15 16 13.657 16 12C16 8.5 12 6 12 6Z" stroke="rgba(72,149,239,0.5)" strokeWidth="1.2" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2" fill="rgba(72,149,239,0.6)" />
                  </svg>
                </div>

                {/* Chip */}
                <div
                  className="absolute top-[52px] right-8 w-10 h-8 rounded overflow-hidden opacity-60"
                  style={{ background: "linear-gradient(135deg,#D4AF37,#FFD700,#B8860B)" }}
                >
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-black/30" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-black/30" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-black/30" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-black/30" />
                </div>

                {/* Card number */}
                <div className="flex gap-4 mb-5 font-mono tracking-[0.2em] text-sm text-white/55">
                  <span>••••</span><span>••••</span><span>••••</span>
                  <span className="text-white/80">4829</span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-white/30 text-[0.6rem] uppercase tracking-widest mb-0.5">Card Holder</div>
                    <div className="text-white/85 text-sm font-medium tracking-wider">ALEX MORGAN</div>
                  </div>
                  <div>
                    <div className="text-white/30 text-[0.6rem] uppercase tracking-widest mb-0.5">Expires</div>
                    <div className="text-white/85 text-sm font-medium">09/28</div>
                  </div>
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full -mr-3" style={{ background: "#EB001B", opacity: 0.85 }} />
                    <div className="w-7 h-7 rounded-full" style={{ background: "#F79E1B", opacity: 0.85 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Perks */}
        <div className="section-reveal reveal-delay-2">
          <div className="badge glass-blue text-blue-light mb-5 w-fit">{t("badge")}</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-[2.8rem] tracking-tight leading-tight mb-5">
            {t("title")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-8 max-w-[440px]">
            {t("subtitle")}
          </p>

          <div className="space-y-4 mb-10">
            {PERKS.map((perk, i) => (
              <div
                key={i}
                className="flex items-start gap-4 glass-card rounded-xl p-4 feature-card"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(72,149,239,0.12)", border: "1px solid rgba(72,149,239,0.2)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5L5 9.5L11 3.5" stroke="#4895EF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{perk.text}</div>
                  <div className="text-white/40 text-xs mt-0.5">{perk.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="btn-primary px-7 py-3.5 rounded-full font-sora font-semibold text-sm gap-2">
            {t("cta")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
