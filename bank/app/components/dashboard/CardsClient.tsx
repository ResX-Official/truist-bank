"use client";
import { useState, useTransition } from "react";
import { CreditCard, Plus, Lock, Unlock, Trash2, X, Check, Eye, EyeOff } from "lucide-react";
import { addCard, freezeCard, deleteCard } from "@/app/actions/cards";
import type { Card } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const GRADIENTS: Record<string, string> = {
  visa: "linear-gradient(135deg, #1B5FBE 0%, #4895EF 100%)",
  mastercard: "linear-gradient(135deg, #1a1a2e 0%, #6B21A8 100%)",
  amex: "linear-gradient(135deg, #0E5F80 0%, #3ECFA0 100%)",
  discover: "linear-gradient(135deg, #7C3100 0%, #F59E0B 100%)",
};

const CURRENT_YEAR = new Date().getFullYear();

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function maskCardNumber(num: string | null) {
  if (!num) return "**** **** **** ****";
  const d = num.replace(/\s/g, "");
  const groups = [];
  for (let i = 0; i < d.length; i += 4) groups.push(d.slice(i, i + 4));
  return groups.map((g, i) => (i < groups.length - 1 ? "****" : g)).join(" ");
}

function StatusBadge({ frozen, label }: { frozen: boolean; label: string }) {
  if (!frozen) return null;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}>
      {label}
    </span>
  );
}

export default function CardsClient({ cards }: { cards: Card[] }) {
  const t = useTranslations("dashboard.cards");
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [form, setForm] = useState({
    cardholder_name: "",
    card_number: "",
    expiry_month: 1,
    expiry_year: CURRENT_YEAR,
    card_type: "visa" as "visa" | "mastercard" | "amex" | "discover",
    cvv: "",
    nickname: "",
  });

  const card = cards[activeIdx];

  function flash(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await addCard(form);
      if (res.error) { flash(res.error, "err"); return; }
      flash(t("success"), "ok");
      setShowAdd(false);
      setShowCvv(false);
      setForm({ cardholder_name: "", card_number: "", expiry_month: 1, expiry_year: CURRENT_YEAR, card_type: "visa", cvv: "", nickname: "" });
      router.refresh();
    });
  }

  function handleFreeze(id: string, freeze: boolean) {
    startTransition(async () => {
      const res = await freezeCard(id, freeze);
      if (res.error) flash(res.error, "err");
      else { flash(freeze ? t("frozen") : t("active"), "ok"); router.refresh(); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this card?")) return;
    startTransition(async () => {
      const res = await deleteCard(id);
      if (res.error) flash(res.error, "err");
      else { flash("Card removed", "ok"); setActiveIdx(0); router.refresh(); }
    });
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 space-y-6" style={{ background: "#0a0a0e" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-white text-xl">{t("title")}</h1>
          <p className="text-white/40 text-sm mt-0.5">{cards.length} card{cards.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
          <Plus size={15} /> {t("addCard")}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: toast.type === "ok" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${toast.type === "ok" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, color: toast.type === "ok" ? "#4ade80" : "#f87171" }}>
          {toast.type === "ok" ? <Check size={14} /> : <X size={14} />}
          {toast.msg}
        </div>
      )}

      {cards.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <CreditCard size={36} className="text-white/15 mx-auto mb-4" />
          <p className="text-white/35 text-sm mb-5">{t("noCards")}</p>
          <button onClick={() => setShowAdd(true)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
            {t("addCard")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: card visual + selector */}
          <div className="space-y-4">
            {cards.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {cards.map((c, i) => (
                  <button key={c.id} onClick={() => setActiveIdx(i)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: activeIdx === i ? "rgba(72,149,239,0.15)" : "rgba(255,255,255,0.04)",
                      color: activeIdx === i ? "#74B9FF" : "rgba(255,255,255,0.4)",
                      border: `1px solid ${activeIdx === i ? "rgba(72,149,239,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    ···· {c.last_four}
                  </button>
                ))}
              </div>
            )}

            {card && (
              <>
                {/* Card visual */}
                <div className="relative rounded-2xl p-6 overflow-hidden select-none" style={{ background: card.is_frozen ? "linear-gradient(135deg,#1a1a2e,#2d2d4e)" : GRADIENTS[card.card_type], minHeight: "180px" }}>
                  <div className="w-9 h-6 rounded mb-5" style={{ background: "linear-gradient(135deg,#C9A227,#FFD700)", opacity: card.is_frozen ? 0.3 : 1 }} />
                  <p className="font-mono text-white text-base tracking-[0.2em] mb-5" style={{ opacity: card.is_frozen ? 0.4 : 1 }}>
                    {maskCardNumber(card.card_number)}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Cardholder</p>
                      <p className="text-white font-semibold text-sm">{card.cardholder_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
                      <p className="text-white font-semibold text-sm">{String(card.expiry_month).padStart(2,"0")}/{String(card.expiry_year).slice(-2)}</p>
                    </div>
                  </div>
                  <p className="absolute top-5 right-5 font-bold text-xs opacity-70 uppercase">{card.card_type}</p>
                  {card.is_frozen && (
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,60,0.5)", backdropFilter: "blur(4px)" }}>
                      <div className="flex items-center gap-2 text-white/70 font-semibold text-sm"><Lock size={16} /> {t("frozen")}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => handleFreeze(card.id, !card.is_frozen)} disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: card.is_frozen ? "rgba(34,197,94,0.1)" : "rgba(72,149,239,0.1)", color: card.is_frozen ? "#4ade80" : "#74B9FF", border: `1px solid ${card.is_frozen ? "rgba(34,197,94,0.2)" : "rgba(72,149,239,0.2)"}` }}>
                    {card.is_frozen ? <><Unlock size={14} /> {t("unfreeze")}</> : <><Lock size={14} /> {t("freeze")}</>}
                  </button>
                  <button onClick={() => handleDelete(card.id)} disabled={isPending}
                    className="px-4 py-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.6)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: card details */}
          {card && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Card Details</p>
              {[
                ["Card Number", maskCardNumber(card.card_number)],
                [t("cardholderName"), card.cardholder_name],
                ["Expires", `${String(card.expiry_month).padStart(2,"0")} / ${card.expiry_year}`],
                [t("cardType"), card.card_type.toUpperCase()],
                ["Nickname", card.nickname || "—"],
                ["Status", card.is_frozen ? t("frozen") : t("active")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-white/40 text-sm">{label}</span>
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    {value}
                    {label === "Status" && <StatusBadge frozen={card.is_frozen} label={t("frozen")} />}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Card Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: "#0f0f17", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-sora font-bold text-white text-lg">{t("addCardTitle")}</h3>
              <button onClick={() => { setShowAdd(false); setShowCvv(false); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {/* Cardholder name */}
              <div>
                <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("cardholderName")}</label>
                <input
                  type="text"
                  value={form.cardholder_name}
                  onChange={e => setForm(f => ({ ...f, cardholder_name: e.target.value }))}
                  placeholder="John Smith"
                  required
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* Card number */}
              <div>
                <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={form.card_number}
                  onChange={e => setForm(f => ({ ...f, card_number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={23}
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20 font-mono tracking-wider"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("expiryMonth")}</label>
                  <select value={form.expiry_month} onChange={e => setForm(f => ({ ...f, expiry_month: Number(e.target.value) }))}
                    className="w-full rounded-xl px-3 py-3 text-white text-sm outline-none" style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{String(m).padStart(2,"0")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("expiryYear")}</label>
                  <select value={form.expiry_year} onChange={e => setForm(f => ({ ...f, expiry_year: Number(e.target.value) }))}
                    className="w-full rounded-xl px-3 py-3 text-white text-sm outline-none" style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {Array.from({ length: 12 }, (_, i) => CURRENT_YEAR + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">CVV</label>
                  <div className="relative">
                    <input
                      type={showCvv ? "text" : "password"}
                      value={form.cvv}
                      onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="•••"
                      maxLength={4}
                      required
                      inputMode="numeric"
                      autoComplete="off"
                      className="w-full rounded-xl px-3 py-3 pr-9 text-white text-sm outline-none placeholder-white/20"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                    <button type="button" onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showCvv ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card type */}
              <div>
                <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">{t("cardType")}</label>
                <select value={form.card_type} onChange={e => setForm(f => ({ ...f, card_type: e.target.value as typeof form.card_type }))}
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none" style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {["visa","mastercard","amex","discover"].map(tp => <option key={tp} value={tp}>{tp.toUpperCase()}</option>)}
                </select>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-white/45 text-xs font-semibold uppercase tracking-wide mb-1.5">Nickname (optional)</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                  placeholder="My Visa"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setShowCvv(false); }} className="flex-1 py-3 rounded-xl text-sm text-white/50" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                  {isPending ? "Adding…" : t("addCard")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
