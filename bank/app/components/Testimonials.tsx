"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

const TESTIMONIALS = [
  {
    quote:
      "Switched from my old bank 8 months ago and I'm never going back. The AI savings alone has helped me put away $4,200 I wouldn't have saved otherwise. Truist Bank is in a different league.",
    name: "Priya Nair",
    role: "Product Designer",
    location: "San Francisco, CA",
    avatar: { initials: "PN", bg: "linear-gradient(135deg, #6C3FC5, #9C72E8)" },
    stars: 5,
    highlight: "$4,200 saved",
  },
  {
    quote:
      "I run a business across 3 countries. Sending international payments used to take 3–5 days with crazy fees. Truist Bank does it in seconds with a real exchange rate. Literally life-changing.",
    name: "Marcus Steele",
    role: "Founder & CEO",
    location: "London, UK",
    avatar: { initials: "MS", bg: "linear-gradient(135deg, #1B5FBE, #4895EF)" },
    stars: 5,
    highlight: "3 countries, 1 account",
  },
  {
    quote:
      "The fraud detection is incredible. My old card got compromised twice in a year. I've been with Truist Bank for 14 months — not a single issue. Their team caught something suspicious even before I did.",
    name: "Aaliya Hassan",
    role: "Software Engineer",
    location: "Toronto, CA",
    avatar: { initials: "AH", bg: "linear-gradient(135deg, #0E9A63, #3ECFA0)" },
    stars: 5,
    highlight: "14 months, 0 fraud",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#FCD34D">
          <path d="M7 1L8.545 5.09H13L9.455 7.91L11 12L7 9.18L3 12L4.545 7.91L1 5.09H5.455L7 1Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useScrollReveal();
  const t = useTranslations("landing.testimonials");

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(27,95,190,0.05) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Testimonials</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight mb-5">
            {t("title")}
          </h2>
          <p className="text-white/45 text-lg max-w-[520px] mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className={`section-reveal reveal-delay-${i + 1} feature-card glass-card rounded-2xl p-7 flex flex-col`}
            >
              {/* Stars + badge */}
              <div className="flex items-center justify-between mb-5">
                <Stars count={testimonial.stars} />
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(72,149,239,0.1)", color: "#74B9FF", border: "1px solid rgba(72,149,239,0.18)" }}
                >
                  {testimonial.highlight}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-white/65 text-sm leading-relaxed flex-1 mb-6 relative">
                <span
                  className="absolute -top-1 -left-1 text-4xl leading-none font-sora font-bold"
                  style={{ color: "rgba(72,149,239,0.2)" }}
                >
                  &ldquo;
                </span>
                <span className="relative z-10 pl-4 block">{testimonial.quote}</span>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: testimonial.avatar.bg }}
                >
                  {testimonial.avatar.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-white/40 text-xs">
                    {testimonial.role} · {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 section-reveal reveal-delay-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#FCD34D">
              <path d="M7 1L8.545 5.09H13L9.455 7.91L11 12L7 9.18L3 12L4.545 7.91L1 5.09H5.455L7 1Z" />
            </svg>
            <span><strong className="text-white">4.9</strong> on App Store</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#FCD34D">
              <path d="M7 1L8.545 5.09H13L9.455 7.91L11 12L7 9.18L3 12L4.545 7.91L1 5.09H5.455L7 1Z" />
            </svg>
            <span><strong className="text-white">4.8</strong> on Google Play</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-white/40 text-sm">
            <strong className="text-white">97%</strong> of customers recommend Truist Bank
          </div>
        </div>
      </div>
    </section>
  );
}
