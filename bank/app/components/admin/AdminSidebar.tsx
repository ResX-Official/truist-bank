"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LayoutDashboard, Users, ArrowDownToLine, Headphones, Shield, LogOut, BarChart2 } from "lucide-react";
import { useTransition } from "react";
import { adminLogout } from "@/app/actions/adminAuth";
import { useRouter } from "next/navigation";

const NAV = [
  { label: "Overview", href: "admin", exact: true, icon: LayoutDashboard },
  { label: "Users", href: "admin/users", exact: false, icon: Users },
  { label: "Withdrawals", href: "admin/withdrawals", exact: false, icon: ArrowDownToLine },
  { label: "Support", href: "admin/support", exact: false, icon: Headphones },
  { label: "Analytics", href: "admin/analytics", exact: false, icon: BarChart2 },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await adminLogout();
      router.push(`/${locale}/admin/login`);
      router.refresh();
      onClose?.();
    });
  };

  return (
    <aside
      className="w-60 h-full flex flex-col border-r border-white/[0.05]"
      style={{ background: "rgba(6,6,10,0.95)" }}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center px-5 border-b border-white/[0.05]">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2.5 w-full" onClick={onClose}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C1B1B, #EF4444)" }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <div className="font-sora font-bold text-white text-[13px] leading-tight">Truist Bank</div>
            <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ label, href, exact, icon: Icon }) => {
          const fullHref = `/${locale}/${href}`;
          const isActive = exact ? pathname === fullHref : pathname.startsWith(fullHref);
          return (
            <Link key={href} href={fullHref} onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? "rgba(239,68,68,0.1)" : "transparent",
                color: isActive ? "#EF4444" : "rgba(255,255,255,0.45)",
                borderLeft: isActive ? "2px solid #EF4444" : "2px solid transparent",
              }}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/[0.05] pt-3">
        <button onClick={handleSignOut} disabled={isPending}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/50 hover:text-red-400 transition-colors w-full">
          <LogOut size={15} />
          {isPending ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
