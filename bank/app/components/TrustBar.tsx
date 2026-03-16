"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const PARTNERS = ["Visa", "Mastercard", "Apple Pay", "Google Pay", "SWIFT", "FDIC"];

function AnimatedStat({ stat, inView }: { stat: { value: number; display: string; label: string; suffix: string }; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        clearInterval(interval);
        setCount(stat.value);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, stat.value]);

  const formatted =
    stat.value >= 1000000
      ? (count / 1000000).toFixed(1) + "M" + stat.suffix
      : stat.value === 12
      ? "$" + Math.floor(count) + stat.suffix
      : stat.value === 99.99
      ? count.toFixed(2) + stat.suffix
      : Math.floor(count) + stat.suffix;

  return (
    <div className="text-center">
      <div
        className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-2 blue-gradient-text"
      >
        {inView ? formatted : "—"}
      </div>
      <div className="text-white/45 text-sm font-medium">{stat.label}</div>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const t = useTranslations("landing.trustBar");

  const STATS = [
    { value: 2500000, display: "2.5M+", label: t("fdic"), suffix: "+" },
    { value: 50, display: "50+", label: t("countries"), suffix: "+" },
    { value: 99.99, display: "99.99%", label: t("uptime"), suffix: "%" },
    { value: 12, display: "$12B+", label: t("encrypted"), suffix: "B+" },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="line-gradient absolute top-0 left-0 right-0" />
      <div className="line-gradient absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>

        {/* Partner logos marquee */}
        <div className="flex items-center gap-4 mb-5">
          <div className="line-gradient flex-1" />
          <span className="text-white/25 text-xs tracking-widest uppercase px-4">Trusted & Integrated</span>
          <div className="line-gradient flex-1" />
        </div>

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: "linear-gradient(90deg, #0E0E10, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: "linear-gradient(270deg, #0E0E10, transparent)" }} />
          <div className="flex animate-marquee gap-12 whitespace-nowrap w-max">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="glass rounded-xl px-6 py-3 text-white/40 font-sora font-semibold text-sm tracking-wider hover:text-white/70 transition-colors inline-flex items-center gap-2"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "rgba(72,149,239,0.5)" }}
                />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
