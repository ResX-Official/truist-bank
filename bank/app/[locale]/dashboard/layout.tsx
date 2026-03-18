"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LayoutDashboard, CreditCard, ArrowDownToLine, MessageCircle, Building2 } from "lucide-react";
import DashboardSidebar from "@/app/components/dashboard/Sidebar";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("dashboard");

  const NAV = [
    { label: t("nav.overview"), href: "dashboard", icon: LayoutDashboard, exact: true },
    { label: t("nav.cards"), href: "dashboard/cards", icon: CreditCard, exact: false },
    { label: t("nav.withdraw"), href: "dashboard/withdraw", icon: ArrowDownToLine, exact: false },
    { label: t("nav.support"), href: "dashboard/support", icon: MessageCircle, exact: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0a0e" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0 sticky top-0 z-10"
          style={{ background: "rgba(8,8,12,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-sora font-bold text-white text-sm">Trust Bank</span>
          </div>
          <LanguageSwitcher currentLocale={locale} />
        </header>

        <div className="flex-1 pb-20 lg:pb-0">
          {children}
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: "rgba(8,8,12,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
      >
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const fullHref = `/${locale}/${href}`;
          const isActive = exact ? pathname === fullHref : pathname.startsWith(fullHref);
          return (
            <Link
              key={href}
              href={fullHref}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
              style={{ color: isActive ? "#4895EF" : "rgba(255,255,255,0.35)" }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
