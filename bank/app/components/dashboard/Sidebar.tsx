"use client";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, ArrowDownToLine, MessageCircle, LogOut, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const t = useTranslations("dashboard");

  const NAV = [
    { label: t("nav.overview"), href: "dashboard", icon: LayoutDashboard, exact: true },
    { label: t("nav.cards"), href: "dashboard/cards", icon: CreditCard, exact: false },
    { label: t("nav.withdraw"), href: "dashboard/withdraw", icon: ArrowDownToLine, exact: false },
    { label: t("nav.support"), href: "dashboard/support", icon: MessageCircle, exact: false },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    onClose?.();
  };

  return (
    <aside
      className="w-64 h-full flex flex-col"
      style={{ background: "rgba(8,8,12,0.98)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href={`/${locale}`} className="flex items-center gap-2.5" onClick={onClose}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1B5FBE, #4895EF)" }}
          >
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-sora font-bold text-white text-[15px]">Truist Bank</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const fullHref = `/${locale}/${href}`;
          const isActive = exact ? pathname === fullHref : pathname.startsWith(fullHref);
          return (
            <Link
              key={href}
              href={fullHref}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? "rgba(72,149,239,0.12)" : "transparent",
                color: isActive ? "#74B9FF" : "rgba(255,255,255,0.5)",
                borderLeft: isActive ? "2px solid #4895EF" : "2px solid transparent",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-4 py-2">
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-colors"
          style={{ color: "rgba(239,68,68,0.6)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(239,68,68,0.6)")}
        >
          <LogOut size={17} />
          {t("nav.signOut")}
        </button>
      </div>
    </aside>
  );
}
