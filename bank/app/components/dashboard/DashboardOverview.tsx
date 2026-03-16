"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CreditCard, ArrowDownToLine, MessageCircle, Wallet, Send } from "lucide-react";
import type { Profile, Account, Transaction } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  profile: Profile | null;
  displayName: string;
  accounts: Account[];
  transactions: Transaction[];
  locale: string;
}

export default function DashboardOverview({ profile, displayName, accounts, transactions, locale }: Props) {
  const t = useTranslations("dashboard.overview");
  const tNav = useTranslations("dashboard.nav");

  const QUICK = [
    { label: tNav("cards"), href: "dashboard/cards", icon: CreditCard, color: "#9C72E8" },
    { label: tNav("withdraw"), href: "dashboard/withdraw", icon: ArrowDownToLine, color: "#4895EF" },
    { label: tNav("support"), href: "dashboard/support", icon: MessageCircle, color: "#3ECFA0" },
  ];

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  return (
    <div className="p-5 lg:p-8 space-y-6" style={{ background: "#0a0a0e" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-white text-xl">{t("title")}</h1>
          <p className="text-white/40 text-sm mt-0.5">{t("welcome")}, {displayName}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">{t("live")}</span>
        </div>
      </div>

      {/* Balance hero */}
      <div className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg, rgba(27,95,190,0.35) 0%, rgba(72,149,239,0.18) 100%)", border: "1px solid rgba(72,149,239,0.25)" }}>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">{t("netWorth")}</p>
        <p className="font-sora font-extrabold text-5xl text-white">{fmt(totalBalance)}</p>
        {accounts.length > 0 && (
          <p className="text-white/40 text-sm mt-2">{accounts.length} account{accounts.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Accounts */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((a) => (
            <div key={a.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/40 text-xs font-medium capitalize">{a.account_type}</span>
                {a.is_primary && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(72,149,239,0.15)", color: "#74B9FF", border: "1px solid rgba(72,149,239,0.25)" }}>{t("primary")}</span>
                )}
              </div>
              <p className="font-sora font-bold text-2xl text-white">{fmt(Number(a.balance))}</p>
              <p className="text-white/30 text-xs mt-1">{a.name}</p>
            </div>
          ))}
        </div>
      )}

      {accounts.length === 0 && (
        <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <Wallet size={28} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/30 text-sm">{t("settingUp")}</p>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">{t("quickActions")}</p>
        <div className="grid grid-cols-3 gap-3">
          {QUICK.map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={`/${locale}/${href}`}
              className="rounded-2xl p-4 flex flex-col items-center gap-3 transition-transform hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
                <Icon size={18} />
              </div>
              <span className="text-white/65 text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="font-sora font-bold text-white text-sm">{t("recentActivity")}</p>
        </div>
        {transactions.length === 0 ? (
          <div className="px-6 py-10 text-center text-white/25 text-sm">{t("noActivity")}</div>
        ) : (
          <div>
            {transactions.map((tx) => {
              const isIn = ["deposit", "transfer_in", "refund"].includes(tx.type);
              return (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isIn ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)" }}>
                    {isIn
                      ? <ArrowDownLeft size={14} className="text-green-400" />
                      : tx.type === "transfer_out" ? <Send size={14} className="text-orange-400" />
                      : <ArrowUpRight size={14} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description || tx.type.replace(/_/g, " ")}</p>
                    <p className="text-white/30 text-xs">{fmtDate(tx.created_at)}</p>
                  </div>
                  <p className={`font-semibold text-sm ${isIn ? "text-green-400" : "text-white"}`}>
                    {isIn ? "+" : "-"}{fmt(Number(tx.amount))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
