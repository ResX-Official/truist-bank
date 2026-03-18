"use client";
import { useState, useTransition } from "react";
import { ArrowDownToLine, Shield, CheckCircle, AlertCircle, Building2, X } from "lucide-react";
import { submitWithdrawal, verifyWithdrawalOTP, cancelWithdrawal } from "@/app/actions/withdrawals";
import type { Account } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";

const US_BANKS = [
  "Ally Bank", "Bank of America", "BMO Bank", "Capital One", "Charles Schwab Bank",
  "Chase", "Citibank", "Citizens Bank", "Discover Bank", "Fifth Third Bank",
  "First Horizon Bank", "Flagstar Bank", "Goldman Sachs Bank", "KeyBank",
  "PNC Bank", "Regions Bank", "TD Bank", "Trust", "U.S. Bank", "Wells Fargo",
  "Other",
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

type Status = "otp_pending" | "processing" | "completed" | "rejected" | "cancelled";

const STATUS: Record<Status, { label: string; color: string }> = {
  otp_pending:  { label: "OTP Pending",  color: "#F59E0B" },
  processing:   { label: "Processing",   color: "#4895EF" },
  completed:    { label: "Completed",    color: "#22C55E" },
  rejected:     { label: "Rejected",     color: "#EF4444" },
  cancelled:    { label: "Cancelled",    color: "rgba(255,255,255,0.3)" },
};

type HistoryRow = {
  id: string; amount: number; bank_name: string; status: string;
  created_at: string; admin_note?: string | null;
};

interface Props { accounts: Account[]; history: HistoryRow[]; }

export default function WithdrawClient({ accounts, history }: Props) {
  const t = useTranslations("dashboard.withdraw");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [reqId, setReqId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isPending, start] = useTransition();
  const [err, setErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [done, setDone] = useState(false);

  const [bankSelect, setBankSelect] = useState("");
  const [form, setForm] = useState({
    account_id: accounts[0]?.id ?? "",
    amount: "",
    bank_name: "",
    routing_number: "",
    account_number: "",
    account_holder_name: "",
    account_type: "checking" as "checking" | "savings",
  });

  const sel = accounts.find(a => a.id === form.account_id);

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      setErr("");
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.bank_name) { setErr("Enter bank name"); return; }
    if (!form.routing_number) { setErr("Enter routing number"); return; }
    if (!form.account_number) { setErr("Enter account number"); return; }
    if (!form.account_holder_name) { setErr("Enter account holder name"); return; }
    if (!form.amount || isNaN(amount) || amount <= 0) { setErr("Enter a valid amount"); return; }

    start(async () => {
      const res = await submitWithdrawal({ ...form, amount });
      if (res.error) { setErr(res.error); return; }
      setReqId(res.requestId!);
      setStep("otp");
    });
  }

  function handleOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!reqId) return;
    setOtpErr("");
    start(async () => {
      const res = await verifyWithdrawalOTP(reqId, otp);
      if (res.error) { setOtpErr(res.error); return; }
      setDone(true);
      setStep("form");
      setBankSelect("");
      setForm({ account_id: accounts[0]?.id ?? "", amount: "", bank_name: "", routing_number: "", account_number: "", account_holder_name: "", account_type: "checking" });
    });
  }

  function handleCancel() {
    if (reqId) start(async () => { await cancelWithdrawal(reqId); });
    setStep("form");
    setOtp("");
    setOtpErr("");
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 space-y-6" style={{ background: "#0a0a0e" }}>
      {/* Header */}
      <div>
        <h1 className="font-sora font-bold text-white text-xl">{t("title")}</h1>
        <p className="text-white/40 text-sm mt-0.5">{t("subtitle")}</p>
      </div>

      {done && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
          <p className="text-green-300 text-sm">{t("otpSuccess")}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form / OTP */}
        <div className="lg:col-span-3">
          {step === "form" ? (
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-sora font-semibold text-white mb-5">{t("title")}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* From account */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("fromAccount")}</label>
                  <select value={form.account_id} onChange={field("account_id")}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id} style={{ background: "#111" }}>
                        {a.name} — {fmt(Number(a.balance))}
                      </option>
                    ))}
                  </select>
                  {sel && <p className="text-white/30 text-xs mt-1">Available: {fmt(Number(sel.balance))}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("amount")}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-semibold">$</span>
                    <input type="number" value={form.amount} onChange={field("amount")}
                      placeholder="0.00" min="0.01" step="0.01"
                      className="w-full rounded-xl pl-8 pr-4 py-3 text-white text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                </div>

                <div className="pt-1 pb-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-white/35 text-xs font-semibold uppercase tracking-widest pt-4 mb-1">{t("bankDetails")}</p>
                </div>

                {/* Bank name */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("bankName")}</label>
                  <select
                    value={bankSelect}
                    onChange={e => {
                      const v = e.target.value;
                      setBankSelect(v);
                      if (v !== "Other") { setForm(f => ({ ...f, bank_name: v })); setErr(""); }
                      else { setForm(f => ({ ...f, bank_name: "" })); }
                    }}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option value="" style={{ background: "#111" }}>{t("selectBank")}</option>
                    {US_BANKS.map(b => (
                      <option key={b} value={b} style={{ background: "#111" }}>{b}</option>
                    ))}
                  </select>
                  {bankSelect === "Other" && (
                    <input value={form.bank_name} onChange={field("bank_name")}
                      placeholder="Enter your bank name"
                      className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20 mt-2"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  )}
                </div>

                {/* Account holder */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("accountHolder")}</label>
                  <input value={form.account_holder_name} onChange={field("account_holder_name")}
                    placeholder="Full name on bank account"
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>

                {/* Account type */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("accountType")}</label>
                  <div className="flex gap-3">
                    {(["checking","savings"] as const).map(t => (
                      <label key={t} className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer"
                        style={{ background: form.account_type === t ? "rgba(72,149,239,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.account_type === t ? "rgba(72,149,239,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                        <input type="radio" name="account_type" value={t} checked={form.account_type === t} onChange={field("account_type")} className="accent-blue-400" />
                        <span className="text-white/80 text-sm capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Routing */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("routingNumber")}</label>
                  <input value={form.routing_number} onChange={field("routing_number")}
                    placeholder="Enter routing number" className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20 font-mono"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>

                {/* Account number */}
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("accountNumber")}</label>
                  <input value={form.account_number} onChange={field("account_number")}
                    placeholder="Your bank account number" className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20 font-mono"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>

                {err && (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{err}</p>
                  </div>
                )}

                <button type="submit" disabled={isPending}
                  className="w-full py-3.5 rounded-xl font-sora font-semibold text-sm text-white mt-2"
                  style={{ background: isPending ? "rgba(72,149,239,0.3)" : "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                  {isPending ? t("submitting") : t("submit")}
                </button>
              </form>
            </div>
          ) : (
            /* OTP step */
            <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.2)" }}>
                  <Shield size={28} className="text-blue-400" />
                </div>
                <h2 className="font-sora font-bold text-white text-xl mb-2">{t("otpTitle")}</h2>
                <p className="text-white/40 text-sm max-w-sm mx-auto">{t("otpSubtitle")}</p>
              </div>

              <form onSubmit={handleOTP} className="space-y-4">
                <input value={otp} onChange={e => { setOtp(e.target.value); setOtpErr(""); }}
                  placeholder="Enter OTP"
                  className="w-full rounded-xl px-4 py-4 text-white text-2xl text-center tracking-[0.4em] outline-none font-mono"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />

                {otpErr && (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <X size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{otpErr}</p>
                  </div>
                )}

                <button type="submit" disabled={isPending || !otp.trim()}
                  className="w-full py-3.5 rounded-xl font-sora font-semibold text-sm text-white"
                  style={{ background: otp.trim() ? "linear-gradient(135deg,#1B5FBE,#4895EF)" : "rgba(255,255,255,0.06)" }}>
                  {isPending ? t("verifying") : t("verify")}
                </button>
                <button type="button" onClick={handleCancel}
                  className="w-full py-3 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                  {t("cancel")}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: info + history */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl p-5" style={{ background: "rgba(72,149,239,0.05)", border: "1px solid rgba(72,149,239,0.12)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">{t("howItWorks")}</span>
            </div>
            <ol className="space-y-2 text-white/40 text-xs">
              {["Fill in your bank details and amount","Click Transfer Money","Contact support to get your OTP","Enter the OTP to confirm","Our team processes the transfer"].map((s,i) => (
                <li key={i} className="flex gap-2"><span className="text-blue-400 font-bold flex-shrink-0">{i+1}.</span>{s}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="font-sora font-semibold text-white text-sm mb-4">{t("recentRequests")}</p>
            {history.length === 0 ? (
              <p className="text-white/25 text-xs text-center py-4">{t("noRequests")}</p>
            ) : (
              <div className="space-y-3">
                {history.map(r => {
                  const s = STATUS[r.status as Status] ?? { label: r.status, color: "rgba(255,255,255,0.3)" };
                  return (
                    <div key={r.id} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm">{fmt(r.amount)}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}>{s.label}</span>
                      </div>
                      <p className="text-white/40 text-xs">{r.bank_name}</p>
                      <p className="text-white/25 text-xs">{new Date(r.created_at).toLocaleDateString()}</p>
                      {r.admin_note && <p className="text-amber-400/70 text-xs mt-1 italic">"{r.admin_note}"</p>}
                      {r.status === "otp_pending" && (
                        <button onClick={() => { setReqId(r.id); setStep("otp"); }} className="mt-2 text-xs text-blue-400 hover:underline">
                          Enter OTP →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
