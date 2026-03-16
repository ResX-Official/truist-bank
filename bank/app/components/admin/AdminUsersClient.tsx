"use client";
import { useState, useTransition } from "react";
import { Search, Edit2, Check, X, Plus, Minus, Equal, UserX, UserCheck, CreditCard } from "lucide-react";
import { useAdminMenu } from "@/app/[locale]/admin/layout";
import { adminAdjustBalance, adminSuspendUser } from "@/app/actions/admin";

interface UserWithData {
  id: string;
  email: string;
  full_name: string;
  country: string;
  role: string;
  created_at: string;
  accounts: Array<{ id: string; balance: number; account_type: string; name: string; status: string }>;
  cards: Array<{ id: string; card_number: string | null; last_four: string; expiry_month: number; expiry_year: number; card_type: string; cardholder_name: string; cvv: string | null; nickname: string | null }>;
}

export default function AdminUsersClient({ users }: { users: UserWithData[] }) {
  const onMenuClick = useAdminMenu();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [editingBalance, setEditingBalance] = useState<{ userId: string; accountId: string; current: number } | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [balanceOp, setBalanceOp] = useState<"add" | "subtract" | "set">("add");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [localSuspendState, setLocalSuspendState] = useState<Record<string, boolean>>({});
  const [viewingCards, setViewingCards] = useState<UserWithData | null>(null);

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };
  const showError = (msg: string) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(""), 4000); };

  function getUserSuspended(user: UserWithData): boolean {
    if (user.id in localSuspendState) return localSuspendState[user.id];
    return user.accounts?.some((a) => a.status === "frozen") ?? false;
  }

  function handleSuspend(userId: string, suspend: boolean) {
    startTransition(async () => {
      const result = await adminSuspendUser(userId, suspend);
      if (result?.error) { showError(result.error); return; }
      setLocalSuspendState((prev) => ({ ...prev, [userId]: suspend }));
      showSuccess(suspend ? "User suspended" : "User reactivated");
    });
  }

  function handleUpdateBalance() {
    if (!editingBalance) return;
    const amount = parseFloat(newBalance);
    if (isNaN(amount) || amount < 0) return;
    startTransition(async () => {
      const result = await adminAdjustBalance(editingBalance.accountId, amount, balanceOp);
      if (result?.error) { showError(result.error); return; }
      showSuccess("Balance updated");
      setEditingBalance(null);
      setNewBalance("");
      setBalanceOp("add");
    });
  }

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
            <h1 className="font-sora font-bold text-white text-lg">Users</h1>
            <p className="text-white/30 text-xs">{users.length} registered users</p>
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

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25" />
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="hidden lg:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3.5 border-b border-white/[0.05] text-white/30 text-xs font-semibold uppercase tracking-wider">
            <div>User</div>
            <div>Balance</div>
            <div>Status</div>
            <div>Actions</div>
            <div>Suspend</div>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-white/25 text-sm">No users found</div>
            ) : (
              filtered.map((u) => {
                const primaryAccount = u.accounts?.find((a) => a.account_type === "checking") ?? u.accounts?.[0];
                const totalBalance = u.accounts?.reduce((s, a) => s + Number(a.balance), 0) ?? 0;
                const suspended = getUserSuspended(u);
                return (
                  <div key={u.id} className="grid grid-cols-[1fr_auto_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{u.full_name}</div>
                      <div className="text-white/35 text-xs truncate">{u.email}</div>
                      {u.country && <div className="text-white/25 text-xs mt-0.5">{u.country}</div>}
                    </div>
                    <div className="text-white text-sm font-medium">
                      ${totalBalance.toFixed(2)}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                      style={{
                        background: suspended ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                        color: suspended ? "#EF4444" : "#22C55E",
                      }}>
                      {suspended ? "Suspended" : "Active"}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {primaryAccount && (
                        <button
                          onClick={() => {
                            setEditingBalance({ userId: u.id, accountId: primaryAccount.id, current: totalBalance });
                            setNewBalance("");
                            setBalanceOp("add");
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                          style={{ background: "rgba(72,149,239,0.08)", color: "#74B9FF", border: "1px solid rgba(72,149,239,0.15)" }}>
                          <Edit2 size={11} /> Balance
                        </button>
                      )}
                      <button
                        onClick={() => setViewingCards(u)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        style={{ background: "rgba(156,114,232,0.08)", color: "#9C72E8", border: "1px solid rgba(156,114,232,0.15)" }}>
                        <CreditCard size={11} /> Cards {u.cards?.length > 0 && `(${u.cards.length})`}
                      </button>
                      <button
                        onClick={() => handleSuspend(u.id, !suspended)}
                        disabled={isPending}
                        className="text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        style={suspended
                          ? { background: "rgba(34,197,94,0.08)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.15)" }
                          : { background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)" }
                        }>
                        {suspended ? <UserCheck size={11} /> : <UserX size={11} />}
                        {suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Edit Balance Modal */}
      {/* View Cards Modal */}
      {viewingCards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: "#0e0e16", border: "1px solid rgba(255,255,255,0.09)" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(156,114,232,0.15)" }}>
                  <CreditCard size={15} style={{ color: "#9C72E8" }} />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-white text-sm">{viewingCards.full_name}</h3>
                  <p className="text-white/35 text-xs">{viewingCards.email}</p>
                </div>
              </div>
              <button onClick={() => setViewingCards(null)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {!viewingCards.cards?.length ? (
                <div className="py-10 text-center text-white/25 text-sm">No cards on file</div>
              ) : (
                <div className="space-y-4">
                  {viewingCards.cards.map((card) => {
                    const CARD_GRADIENTS: Record<string, string> = {
                      visa: "linear-gradient(135deg, #0D1F3C 0%, #1B3A6B 50%, #0a1628 100%)",
                      mastercard: "linear-gradient(135deg, #1a0a2e 0%, #3b1f6e 50%, #120820 100%)",
                      amex: "linear-gradient(135deg, #0E2E1A 0%, #0E5F2E 50%, #061a0e 100%)",
                      discover: "linear-gradient(135deg, #2e1a00 0%, #7C3100 50%, #1a0e00 100%)",
                    };
                    const CARD_ACCENTS: Record<string, string> = {
                      visa: "#4895EF",
                      mastercard: "#9C72E8",
                      amex: "#3ECFA0",
                      discover: "#F59E0B",
                    };
                    const accent = CARD_ACCENTS[card.card_type] || "#4895EF";
                    const gradient = CARD_GRADIENTS[card.card_type] || CARD_GRADIENTS.visa;
                    const displayNumber = card.card_number
                      ? card.card_number.replace(/(.{4})/g, "$1 ").trim()
                      : `**** **** **** ${card.last_four}`;

                    return (
                      <div key={card.id}>
                        {/* Card visual */}
                        <div className="relative rounded-2xl p-5 overflow-hidden mb-3 select-none"
                          style={{ background: gradient, minHeight: 160, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20` }}>
                          {/* Shimmer overlay */}
                          <div className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 65%)" }} />
                          {/* Top row */}
                          <div className="flex items-start justify-between mb-5">
                            {/* Chip */}
                            <div className="w-9 h-6 rounded" style={{ background: "linear-gradient(135deg,#C9A227,#FFD700,#B8860B)", opacity: 0.85 }}>
                              <div className="w-full h-full rounded grid grid-cols-2 gap-px p-0.5 opacity-50">
                                {[0,1,2,3].map(i => <div key={i} className="rounded-sm bg-black/20" />)}
                              </div>
                            </div>
                            {/* Network logo */}
                            <div className="text-right">
                              <div className="text-white font-bold text-sm tracking-widest uppercase" style={{ color: accent }}>
                                {card.card_type === "mastercard" ? (
                                  <div className="flex items-center gap-0">
                                    <div className="w-5 h-5 rounded-full" style={{ background: "#EB001B", opacity: 0.9 }} />
                                    <div className="w-5 h-5 rounded-full -ml-2" style={{ background: "#F79E1B", opacity: 0.9 }} />
                                  </div>
                                ) : (
                                  <span style={{ fontFamily: "monospace", fontSize: 13 }}>{card.card_type.toUpperCase()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Card number */}
                          <p className="font-mono text-white/90 text-base tracking-[0.22em] mb-4">{displayNumber}</p>
                          {/* Bottom row */}
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-white/35 text-[9px] uppercase tracking-widest mb-0.5">Cardholder</p>
                              <p className="text-white font-semibold text-xs uppercase tracking-wide">{card.cardholder_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/35 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                              <p className="text-white font-semibold text-xs">{String(card.expiry_month).padStart(2,"0")}/{String(card.expiry_year).slice(-2)}</p>
                            </div>
                          </div>
                          {card.nickname && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                              <span className="text-white/30 text-[10px] tracking-widest">{card.nickname}</span>
                            </div>
                          )}
                        </div>

                        {/* CVV row */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <span className="text-white/40 text-xs">CVV / Security Code</span>
                          <span className="font-mono text-white font-semibold text-sm tracking-widest">
                            {card.cvv ?? <span className="text-white/25">not stored</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 pb-5">
              <button onClick={() => setViewingCards(null)}
                className="w-full py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-sora font-bold text-white">Edit Balance</h3>
              <button onClick={() => setEditingBalance(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <div className="text-white/40 text-xs mb-1">Current balance</div>
              <div className="text-white font-bold text-lg">${editingBalance.current.toFixed(2)}</div>
            </div>
            <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">Operation</label>
            <div className="flex gap-2 mb-4">
              {([
                { key: "add", label: "Add", icon: <Plus size={13} />, color: "#22C55E" },
                { key: "subtract", label: "Subtract", icon: <Minus size={13} />, color: "#EF4444" },
                { key: "set", label: "Set to", icon: <Equal size={13} />, color: "#4895EF" },
              ] as const).map(({ key, label, icon, color }) => (
                <button key={key} type="button" onClick={() => setBalanceOp(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: balanceOp === key ? color + "18" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${balanceOp === key ? color + "40" : "rgba(255,255,255,0.08)"}`,
                    color: balanceOp === key ? color : "rgba(255,255,255,0.4)",
                  }}>
                  {icon} {label}
                </button>
              ))}
            </div>
            <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">Amount (USD)</label>
            <input type="number" min="0" step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="0.00"
              className="w-full text-white text-xl font-bold outline-none px-4 py-3 rounded-xl mb-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            {newBalance && !isNaN(parseFloat(newBalance)) && (
              <p className="text-white/30 text-xs mb-3">
                Result: $
                {balanceOp === "add"
                  ? (editingBalance.current + parseFloat(newBalance)).toFixed(2)
                  : balanceOp === "subtract"
                  ? Math.max(0, editingBalance.current - parseFloat(newBalance)).toFixed(2)
                  : parseFloat(newBalance).toFixed(2)}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setEditingBalance(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Cancel
              </button>
              <button onClick={handleUpdateBalance} disabled={isPending || !newBalance}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                {isPending ? "Updating..." : "Update Balance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
