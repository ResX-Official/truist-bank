"use client";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTranslations } from "next-intl";

export default function BlogPreview() {
  const ref = useScrollReveal();
  const t = useTranslations("landing.blog");

  const POSTS = [
    {
      category: t("p1Category"),
      categoryColor: "#4895EF",
      title: t("p1Title"),
      excerpt: t("p1Excerpt"),
      author: t("p1Author"),
      authorInitials: "MT",
      authorBg: "linear-gradient(135deg, #4895EF, #74B9FF)",
      date: "Feb 24, 2026",
      readTime: "5 min read",
      gradient: "linear-gradient(135deg, #0D1F3C, #1B3A6B)",
    },
    {
      category: t("p2Category"),
      categoryColor: "#9C72E8",
      title: t("p2Title"),
      excerpt: t("p2Excerpt"),
      author: t("p2Author"),
      authorInitials: "DL",
      authorBg: "linear-gradient(135deg, #6C3FC5, #9C72E8)",
      date: "Feb 18, 2026",
      readTime: "7 min read",
      gradient: "linear-gradient(135deg, #1A0A2E, #3b1f6e)",
    },
    {
      category: t("p3Category"),
      categoryColor: "#3ECFA0",
      title: t("p3Title"),
      excerpt: t("p3Excerpt"),
      author: t("p3Author"),
      authorInitials: "PN",
      authorBg: "linear-gradient(135deg, #0E9A63, #3ECFA0)",
      date: "Feb 12, 2026",
      readTime: "4 min read",
      gradient: "linear-gradient(135deg, #0E2E1A, #0E5F2E)",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(72,149,239,0.04) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 section-reveal">
          <div>
            <div className="badge glass-blue text-blue-light mb-4 w-fit">{t("badge")}</div>
            <h2 className="font-sora font-extrabold text-4xl lg:text-5xl tracking-tight">
              {t("title")} <span className="gradient-text">{t("titleHighlight")}</span>
            </h2>
          </div>
          <a
            href="#"
            className="text-blue-light text-sm font-semibold hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {t("viewAll")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <a
              key={i}
              href="#"
              className={`section-reveal reveal-delay-${i + 1} feature-card glass-card rounded-2xl overflow-hidden group block`}
            >
              {/* Card top gradient */}
              <div className="h-36 relative overflow-hidden" style={{ background: post.gradient }}>
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div
                  className="absolute bottom-4 left-4 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: post.categoryColor, border: `1px solid ${post.categoryColor}30` }}
                >
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-sora font-bold text-white text-base leading-snug mb-3 group-hover:text-blue-faint transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: post.authorBg }}
                  >
                    {post.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/60 text-xs font-medium truncate">{post.author}</div>
                    <div className="text-white/25 text-[11px]">
                      {post.date} · {post.readTime}
                    </div>
                  </div>
                  <svg
                    className="flex-shrink-0 text-white/20 group-hover:text-blue/70 transition-colors"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
