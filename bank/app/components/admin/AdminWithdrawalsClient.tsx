"use client";
import { useState, useTransition } from "react";
import {
  ArrowDownToLine, Check, X, ChevronDown,
  Clock, CheckCircle, XCircle, RotateCcw, Send,
} from "lucide-react";
import { useAdminMenu } from "@/app/[locale]/admin/layout";
import { adminApproveWithdrawal, adminRejectWithdrawal, adminProvideOTP } from "@/app/actions/admin";
import type { WithdrawalRequest } from "@/lib/supabase/types";

interface EnrichedRequest extends WithdrawalRequest {
  user_name: string;
  user_email: string;
}

type Filter = "all" | "otp_pending" | "processing" | "completed" | "rejected" | "cancelled";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    otp_pending: { label: "OTP Pending", color: "#F59E0B", icon: <Clock size={11} /> },
    processing: { label: "Processing", color: "#4895EF", icon: <RotateCcw size={11} /> },
    completed: { label: "Completed", color: "#22C55E", icon: <CheckCircle size={11} /> },
    rejected: { label: "Rejected", color: "#EF4444", icon: <XCircle size={11} /> },
    cancelled: { label: "Cancelled", color: "rgba(255,255,255,0.3)", icon: <X size={11} /> },
    pending: { label: "Pending", color: "#8B5CF6", icon: <Clock size={11} /> },
  };
  const s = map[status] || { label: status, color: "rgba(255,255,255,0.3)", icon: null };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: s.color + "18", color: s.color, border: `1px solid ${s.color}33` }}>
      {s.icon}{s.label}
    </span>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function AdminWithdrawalsClient({ requests }: { requests: EnrichedRequest[] }) {
  const onMenuClick = useAdminMenu();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpSentFor, setOtpSentFor] = useState<Set<string>>(new Set());

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };
  const showError = (msg: string) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(""), 4000); };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    otp_pending: requests.filter((r) => r.status === "otp_pending").length,
    processing: requests.filter((r) => r.status === "processing").length,
    completed: requests.filter((r) => r.status === "completed").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  function handleSetOTP(requestId: string) {
    const otp = otpInputs[requestId]?.trim();
    if (!otp) { showError("Enter an OTP to send to the user"); return; }
    startTransition(async () => {
      const result = await adminProvideOTP(requestId, otp);
      if (result.error) { showError(result.error); return; }
      setOtpSentFor((prev) => new Set([...prev, requestId]));
      setOtpInputs((prev) => ({ ...prev, [requestId]: "" }));
      showSuccess(`OTP "${otp}" set — share it with the user`);
    });
  }

  function handleApprove(requestId: string) {
    startTransition(async () => {
      const result = await adminApproveWithdrawal(requestId);
      if (result.error) { showError(result.error); return; }
      showSuccess("Withdrawal approved successfully");
    });
  }

  function handleReject() {
    if (!rejectingId) return;
    startTransition(async () => {
      const result = await adminRejectWithdrawal(rejectingId, rejectNote || "");
      if (result.error) { showError(result.error); return; }
      showSuccess("Withdrawal rejected");
      setRejectingId(null);
      setRejectNote("");
    });
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "otp_pending", label: "OTP Pending" },
    { key: "processing", label: "Processing" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0e" }}>
      <header
        className="h-[72px] flex items-center gap-4 px-6 lg:px-8 border-b border-white/[0.05]"
        style={{ background: "rgba(6,6,10,0.8)", backdropFilter: "blur(20px)" }}
      >
        <button onClick={onMenuClick} className="lg:hidden text-white/40 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}>
            <ArrowDownToLine size={17} className="text-blue-400" />
          </div>
          <div>
            <h1 className="font-sora font-bold text-white text-lg">Withdrawal Requests</h1>
            <p className="text-white/30 text-xs">{counts.processing} processing · {counts.otp_pending} awaiting OTP</p>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-5">
        {successMsg && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-green-400 text-sm"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Check size={14} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-red-400 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <X size={14} /> {errorMsg}
          </div>
        )}

        {/* Filter tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: filter === key ? "rgba(72,149,239,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${filter === key ? "rgba(72,149,239,0.25)" : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="text-xl font-bold" style={{ color: filter === key ? "#74B9FF" : "white" }}>
                {counts[key]}
              </div>
              <div className="text-xs mt-0.5" style={{ color: filter === key ? "#74B9FF" : "rgba(255,255,255,0.3)" }}>
                {label}
              </div>
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-white/25 text-sm">No requests in this category</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((r) => {
                const isExpanded = expandedId === r.id;
                const otpAlreadySent = otpSentFor.has(r.id) || (r.otp && r.otp.length > 0);
                return (
                  <div key={r.id} className="transition-colors hover:bg-white/[0.02]">
                    {/* Main row */}
                    <div className="flex items-center gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{r.user_name}</div>
                        <div className="text-white/35 text-xs truncate">{r.user_email}</div>
                      </div>
                      <div className="text-white font-bold text-sm w-24 text-right hidden sm:block">{fmt(r.amount)}</div>
                      <div className="text-white/40 text-xs hidden lg:block w-28 truncate">{r.bank_name}</div>
                      <div className="hidden sm:block"><StatusBadge status={r.status} /></div>
                      <div className="text-white/25 text-xs hidden lg:block w-20">{new Date(r.created_at).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {(r.status === "otp_pending" || r.status === "processing") && (
                          <button
                            onClick={() => { setRejectingId(r.id); setRejectNote(""); }}
                            className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                            style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                            <X size={11} /> Reject
                          </button>
                        )}
                        {r.status === "processing" && (
                          <button
                            onClick={() => handleApprove(r.id)}
                            disabled={isPending}
                            className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                            style={{ background: "rgba(34,197,94,0.08)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>
                            <Check size={11} /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : r.id)}
                          className="text-white/30 hover:text-white/60 transition-colors p-1">
                          <ChevronDown size={15} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* OTP input for otp_pending */}
                    {r.status === "otp_pending" && (
                      <div className="px-5 pb-4">
                        <div className="rounded-xl p-4"
                          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                          <div className="text-amber-400/70 text-xs font-semibold mb-2 uppercase tracking-wider">
                            {otpAlreadySent ? "Update OTP" : "Set OTP for user"}
                          </div>
                          {otpAlreadySent && r.otp && (
                            <div className="text-amber-300/60 text-xs mb-2">
                              Current OTP: <span className="font-mono font-bold">{r.otp}</span>
                              {r.otp_verified && <span className="ml-2 text-green-400">(Verified by user)</span>}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              value={otpInputs[r.id] ?? ""}
                              onChange={(e) => setOtpInputs((prev) => ({ ...prev, [r.id]: e.target.value }))}
                              placeholder="Enter OTP (e.g. 123456)"
                              className="flex-1 rounded-lg px-3 py-2 text-white text-sm outline-none placeholder-white/25 font-mono"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}
                            />
                            <button
                              onClick={() => handleSetOTP(r.id)}
                              disabled={isPending || !otpInputs[r.id]?.trim()}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                              style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                              <Send size={12} /> Send OTP
                            </button>
                          </div>
                          <p className="text-amber-400/40 text-[11px] mt-2">
                            Set the OTP here, then share it with the user via phone or email.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Amount</div>
                            <div className="text-white font-semibold text-sm mt-0.5">{fmt(r.amount)}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Bank</div>
                            <div className="text-white text-sm mt-0.5">{r.bank_name}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Account Type</div>
                            <div className="text-white text-sm mt-0.5 capitalize">{r.account_type}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Account Holder</div>
                            <div className="text-white text-sm mt-0.5">{r.account_holder_name}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Routing #</div>
                            <div className="text-white font-mono text-sm mt-0.5">{r.routing_number}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Account #</div>
                            <div className="text-white font-mono text-sm mt-0.5">{r.account_number}</div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">OTP Verified</div>
                            <div className={`text-sm mt-0.5 ${r.otp_verified ? "text-green-400" : "text-amber-400"}`}>
                              {r.otp_verified ? "Yes" : "No"}
                            </div>
                          </div>
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">Submitted</div>
                            <div className="text-white/60 text-sm mt-0.5">{new Date(r.created_at).toLocaleString()}</div>
                          </div>
                          {r.admin_note && (
                            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                              <div className="text-white/30 text-[10px] uppercase tracking-wider">Admin Note</div>
                              <div className="text-amber-400/70 text-sm mt-0.5 italic">&quot;{r.admin_note}&quot;</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#111118", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-400" />
                <h3 className="font-sora font-bold text-white">Reject Withdrawal</h3>
              </div>
              <button onClick={() => setRejectingId(null)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-white/40 text-sm mb-4">Optionally provide a reason for the user.</p>
            <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">Reason (optional)</label>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g. Invalid bank details, compliance hold..."
              rows={3}
              className="w-full text-white text-sm outline-none px-4 py-3 rounded-xl resize-none placeholder-white/20 mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectingId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Cancel
              </button>
              <button onClick={handleReject} disabled={isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7C1B1B,#EF4444)" }}>
                {isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
