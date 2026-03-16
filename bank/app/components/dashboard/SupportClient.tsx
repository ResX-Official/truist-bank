"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { Send, Headphones, MessageCircle } from "lucide-react";
import { sendSupportMessage, fetchUserSupportMessages } from "@/app/actions/support";
import type { SupportMessage } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";

interface Props { userId: string; initialMessages: SupportMessage[]; }

export default function SupportClient({ userId, initialMessages }: Props) {
  const t = useTranslations("dashboard.support");
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [isPending, start] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll every 2s — simple, no duplicates, works regardless of RLS/realtime config
  useEffect(() => {
    const poll = async () => {
      const data = await fetchUserSupportMessages(userId);
      if (data) setMessages(data as SupportMessage[]);
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    const text = input.trim();
    setInput("");
    setSendError(null);
    start(async () => {
      const res = await sendSupportMessage(text);
      if (res.error) setSendError(res.error);
    });
  }

  return (
    <div className="min-h-screen p-5 lg:p-8 flex flex-col" style={{ background: "#0a0a0e" }}>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}>
            <Headphones size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="font-sora font-bold text-white text-xl">{t("title")}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              <span className="text-white/40 text-xs">{t("online")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden max-w-2xl w-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "60vh" }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <MessageCircle size={36} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm">{t("empty")}</p>
              <p className="text-white/20 text-xs mt-1">{t("avgResponse")}</p>
            </div>
          ) : messages.map(msg => {
            const isUser = msg.sender_type === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1" style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                    <Headphones size={12} className="text-white" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isUser ? "linear-gradient(135deg,#1B5FBE,#4895EF)" : "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.9)",
                      borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}>
                    {msg.message}
                  </div>
                  <p className={`text-white/25 text-[10px] mt-1 ${isUser ? "text-right" : ""}`}>
                    {isUser ? "You" : "Support"} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {sendError && (
            <p className="text-red-400 text-xs mb-2 px-1">{sendError}</p>
          )}
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-white/25"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            <button type="submit" disabled={isPending || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{ background: input.trim() ? "linear-gradient(135deg,#1B5FBE,#4895EF)" : "rgba(255,255,255,0.05)" }}>
              <Send size={15} className="text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
