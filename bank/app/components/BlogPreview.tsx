"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";

const TESTIMONIALS = [
  {
    quote: "Having all my accounts — checking, savings, and investments — in one clean dashboard is something I didn't know I needed until I tried Trust.",
    name: "Marcus T.",
    role: "Freelance Designer",
    initials: "MT",
    bg: "linear-gradient(135deg, #1B5FBE, #4895EF)",
    accentColor: "#4895EF",
  },
  {
    quote: "Sending money to clients used to be a hassle. With Trust I just enter their email and it's done. The transfer history is clean and always accurate.",
    name: "Priya S.",
    role: "Small Business Owner",
    initials: "PS",
    bg: "linear-gradient(135deg, #5B21B6, #8B5CF6)",
    accentColor: "#8B5CF6",
  },
  {
    quote: "Being able to freeze my card instantly from the dashboard gives me real peace of mind. The security features here are genuinely best-in-class.",
    name: "James O.",
    role: "Software Engineer",
    initials: "JO",
    bg: "linear-gradient(135deg, #065F46, #10B981)",
    accentColor: "#10B981",
  },
];

export default function BlogPreview() {
  const ref = useScrollReveal();

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(72,149,239,0.04) 0%, transparent 60%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 section-reveal">
          <div className="badge glass-blue text-blue-light mb-5 mx-auto w-fit">Members</div>
          <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight">
            Trusted by people{" "}
            <span className="gradient-text">like you</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`section-reveal reveal-delay-${i + 1} feature-card glass-card rounded-2xl p-7 flex flex-col`}
            >
              {/* Quote mark */}
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="mb-5 flex-shrink-0">
                <path
                  d="M0 20V12.667C0 5.778 3.556 1.556 10.667 0L12 2.444C8.444 3.556 6.222 5.778 6.222 8.889h5.111V20H0zm16 0V12.667C16 5.778 19.556 1.556 26.667 0L28 2.444C24.444 3.556 22.222 5.778 22.222 8.889h5.111V20H16z"
                  fill={t.accentColor}
                  opacity="0.35"
                />
              </svg>

              <p className="text-white/65 text-sm leading-relaxed flex-1 mb-7">{t.quote}</p>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: t.bg }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/35 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
