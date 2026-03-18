"use client";
import { BarChart2, Users, CreditCard, ArrowDownToLine, MessageCircle, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useAdminMenu } from "@/app/components/admin/AdminMenuContext";

interface Props {
  totalUsers: number;
  totalCards: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  totalVolume: number;
  avgWithdrawal: number;
  totalMessages: number;
  monthlyData: { month: string; volume: number; count: number }[];
  recentUsers: Array<{ id: string; full_name: string; email: string; created_at: string }>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminAnalyticsClient({
  totalUsers,
  totalCards,
  totalWithdrawals,
  pendingWithdrawals,
  completedWithdrawals,
  totalVolume,
  avgWithdrawal,
  totalMessages,
  monthlyData,
  recentUsers,
}: Props) {
  const onMenuClick = useAdminMenu();

  const successRate = totalWithdrawals > 0
    ? Math.round((completedWithdrawals / totalWithdrawals) * 100)
    : 0;

  const maxVolume = Math.max(...monthlyData.map((m) => m.volume), 1);

  const STAT_CARDS = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "#4895EF", bg: "rgba(72,149,239,0.1)" },
    { label: "Payment Cards", value: totalCards.toLocaleString(), icon: CreditCard, color: "#9C72E8", bg: "rgba(156,114,232,0.1)" },
    { label: "Total Volume", value: fmt(totalVolume), icon: TrendingUp, color: "#3ECFA0", bg: "rgba(62,207,160,0.1)" },
    { label: "Avg Withdrawal", value: fmt(avgWithdrawal), icon: ArrowDownToLine, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "Completed", value: completedWithdrawals.toLocaleString(), icon: CheckCircle, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    { label: "Pending", value: pendingWithdrawals.toLocaleString(), icon: Clock, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
    { label: "Withdrawals", value: totalWithdrawals.toLocaleString(), icon: ArrowDownToLine, color: "#4895EF", bg: "rgba(72,149,239,0.1)" },
    { label: "Support Messages", value: totalMessages.toLocaleString(), icon: MessageCircle, color: "#74B9FF", bg: "rgba(116,185,255,0.1)" },
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
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-red-400" />
            <div>
              <h1 className="font-sora font-bold text-white text-lg">Analytics</h1>
              <p className="text-white/30 text-xs">Platform performance & insights</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">Live</span>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div className="font-sora font-bold text-xl text-white">{value}</div>
              <div className="text-white/35 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Success rate bar */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-sora font-bold text-white text-sm">Withdrawal Success Rate</p>
            <span className="font-bold text-sm" style={{ color: successRate >= 70 ? "#22C55E" : "#EF4444" }}>
              {successRate}%
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${successRate}%`,
                background: successRate >= 70
                  ? "linear-gradient(90deg,#16a34a,#22C55E)"
                  : "linear-gradient(90deg,#dc2626,#EF4444)",
              }}
            />
          </div>
          <div className="flex justify-between text-white/25 text-xs mt-2">
            <span>{completedWithdrawals} completed</span>
            <span>{totalWithdrawals} total</span>
          </div>
        </div>

        {/* Monthly volume chart */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-sora font-bold text-white text-sm mb-6">Monthly Withdrawal Volume (Completed)</p>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((m) => {
              const height = maxVolume > 0 ? Math.max((m.volume / maxVolume) * 100, 2) : 2;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-white/30 text-[10px] font-medium">{m.volume > 0 ? fmt(m.volume) : ""}</div>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 relative group"
                    style={{
                      height: `${height}%`,
                      background: "linear-gradient(180deg, #4895EF, #1B5FBE)",
                      minHeight: 4,
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-[10px] text-white bg-black/80 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {m.count} withdrawal{m.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-white/30 text-[10px]">{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent new users */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="font-sora font-bold text-white text-sm">Recently Registered Users</p>
          </div>
          {recentUsers.length === 0 ? (
            <div className="px-6 py-8 text-center text-white/25 text-sm">No users yet</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                      {u.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{u.full_name}</div>
                      <div className="text-white/35 text-xs">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-white/30 text-xs">{fmtDate(u.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
