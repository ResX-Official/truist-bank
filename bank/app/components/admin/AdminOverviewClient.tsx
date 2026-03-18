"use client";
import Link from "next/link";
import { useAdminMenu } from "@/app/components/admin/AdminMenuContext";
import { Users, ArrowDownToLine, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";

interface RecentRequest {
  id: string;
  user_name: string;
  user_email: string;
  amount: number;
  bank_name: string;
  status: string;
  created_at: string;
}

interface Props {
  totalUsers: number;
  pendingWithdrawals: number;
  unreadMessages: number;
  recentRequests: RecentRequest[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const STATUS_COLORS: Record<string, string> = {
  otp_pending: "#F59E0B",
  processing: "#4895EF",
  completed: "#22C55E",
  rejected: "#EF4444",
  cancelled: "rgba(255,255,255,0.3)",
};

export default function AdminOverviewClient({ totalUsers, pendingWithdrawals, unreadMessages, recentRequests }: Props) {
  const onMenuClick = useAdminMenu();
  const params = useParams();
  const locale = params.locale as string;

  const STATS = [
    { label: "Total Users", value: totalUsers.toLocaleString(), color: "#4895EF", icon: <Users size={20} /> },
    { label: "Pending Withdrawals", value: pendingWithdrawals.toLocaleString(), color: "#F59E0B", icon: <ArrowDownToLine size={20} /> },
    { label: "Unread Messages", value: unreadMessages.toLocaleString(), color: "#22C55E", icon: <MessageCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0e" }}>
      <header
        className="h-[72px] flex items-center justify-between px-6 lg:px-8 border-b border-white/[0.05]"
        style={{ background: "rgba(6,6,10,0.8)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-white/40 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 className="font-sora font-bold text-white text-lg">Dashboard</h1>
            <p className="text-white/30 text-xs">Admin Overview</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">Online</span>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl p-6 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "18", color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="font-sora font-extrabold text-2xl text-white">{s.value}</div>
                <div className="text-white/40 text-sm mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent pending withdrawals */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <h2 className="font-sora font-bold text-white">Pending Withdrawals</h2>
            <Link href={`/${locale}/admin/withdrawals`} className="text-xs font-semibold" style={{ color: "#74B9FF" }}>
              View all →
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <div className="py-12 text-center text-white/25 text-sm">No pending withdrawals</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">{r.user_name}</div>
                    <div className="text-white/35 text-xs truncate">{r.user_email}</div>
                  </div>
                  <div className="text-white font-bold text-sm">{fmt(r.amount)}</div>
                  <div className="text-white/40 text-xs hidden sm:block truncate max-w-[100px]">{r.bank_name}</div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0"
                    style={{
                      background: (STATUS_COLORS[r.status] || "rgba(255,255,255,0.3)") + "18",
                      color: STATUS_COLORS[r.status] || "rgba(255,255,255,0.5)",
                    }}>
                    {r.status === "otp_pending" ? "OTP Pending" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                  <div className="text-white/25 text-xs hidden lg:block flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Manage Users", href: `/${locale}/admin/users`, color: "#4895EF" },
            { label: "Withdrawals", href: `/${locale}/admin/withdrawals`, color: "#F59E0B" },
            { label: "Support Chat", href: `/${locale}/admin/support`, color: "#22C55E" },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="rounded-2xl p-5 text-sm font-semibold transition-all hover:scale-[1.01]"
              style={{ background: link.color + "0A", border: `1px solid ${link.color}22`, color: link.color }}>
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
