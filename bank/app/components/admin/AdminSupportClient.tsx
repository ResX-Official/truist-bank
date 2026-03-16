"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { Headphones, Send, MessageCircle, Users, ArrowLeft } from "lucide-react";
import { adminSendSupportMessage, adminFetchAllSupportMessages } from "@/app/actions/support";
import { createClient } from "@/lib/supabase/client";
import type { SupportMessage } from "@/lib/supabase/types";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

interface Props {
  initialMessages: SupportMessage[];
  userProfiles: UserProfile[];
  adminId: string;
}

interface UserConversation {
  userId: string;
  profile: UserProfile;
  messages: SupportMessage[];
  unreadCount: number;
  lastMessageTime: string;
}

export default function AdminSupportClient({ initialMessages, userProfiles, adminId }: Props) {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const profileMap = Object.fromEntries(userProfiles.map((p) => [p.id, p]));

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-support-all")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
      }, (payload) => {
        const msg = payload.new as SupportMessage;
        setMessages((prev) => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Polling fallback — admin uses custom auth (not Supabase), so realtime may be blocked by RLS
  useEffect(() => {
    const poll = async () => {
      const data = await adminFetchAllSupportMessages();
      if (data) setMessages(data as SupportMessage[]);
    };
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserId]);

  // Build conversations grouped by user
  const conversations: UserConversation[] = userProfiles.map((profile) => {
    const userMessages = messages.filter((m) => m.user_id === profile.id);
    const unreadCount = userMessages.filter((m) => m.sender_type === "user" && !m.read).length;
    const last = userMessages[userMessages.length - 1];
    return {
      userId: profile.id,
      profile,
      messages: userMessages,
      unreadCount,
      lastMessageTime: last?.created_at || "",
    };
  }).sort((a, b) => {
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  // Include users who sent messages but aren't in userProfiles (edge case)
  const profileUserIds = new Set(userProfiles.map((p) => p.id));
  const extraUserIds = [...new Set(messages.map((m) => m.user_id))].filter((id) => !profileUserIds.has(id));
  for (const uid of extraUserIds) {
    const userMessages = messages.filter((m) => m.user_id === uid);
    const last = userMessages[userMessages.length - 1];
    conversations.push({
      userId: uid,
      profile: { id: uid, full_name: "Unknown User", email: uid },
      messages: userMessages,
      unreadCount: userMessages.filter((m) => m.sender_type === "user" && !m.read).length,
      lastMessageTime: last?.created_at || "",
    });
  }

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);
  const threadMessages = selectedConversation?.messages || [];

  function handleSelectUser(userId: string) {
    setSelectedUserId(userId);
    setMobileView("chat");
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isPending || !selectedUserId) return;
    const text = input.trim();
    setInput("");
    startTransition(async () => {
      await adminSendSupportMessage(selectedUserId, text);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0e" }}>
      {/* Header */}
      <header
        className="h-[72px] flex items-center gap-4 px-6 lg:px-8 border-b border-white/[0.05]"
        style={{ background: "rgba(6,6,10,0.8)", backdropFilter: "blur(20px)" }}
      >
        <button
          className="lg:hidden text-white/40 hover:text-white"
          onClick={() => {
            if (mobileView === "chat") { setMobileView("list"); setSelectedUserId(null); }
          }}
        >
          {mobileView === "chat"
            ? <ArrowLeft size={20} />
            : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          }
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(72,149,239,0.1)", border: "1px solid rgba(72,149,239,0.15)" }}>
            <Headphones size={17} className="text-blue-400" />
          </div>
          <div>
            <h1 className="font-sora font-bold text-white text-lg">Customer Support</h1>
            <p className="text-white/30 text-xs">
              {conversations.length} conversations ·{" "}
              {conversations.reduce((s, c) => s + c.unreadCount, 0)} unread
            </p>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-72px)]">
        {/* User list */}
        <div
          className={`border-r border-white/[0.05] flex flex-col ${mobileView === "chat" ? "hidden" : "flex"} lg:flex w-full lg:w-72 flex-shrink-0`}
          style={{ background: "rgba(6,6,10,0.6)" }}
        >
          <div className="px-4 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Users size={13} className="text-white/30" />
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Conversations</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageCircle size={32} className="text-white/10 mb-2" />
                <p className="text-white/25 text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedUserId === conv.userId;
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.userId}
                    onClick={() => handleSelectUser(conv.userId)}
                    className="w-full text-left px-4 py-3.5 border-b border-white/[0.03] transition-all"
                    style={{
                      background: isSelected ? "rgba(72,149,239,0.08)" : "transparent",
                      borderLeft: isSelected ? "2px solid #4895EF" : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                          {conv.profile.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{conv.profile.full_name}</div>
                          {lastMsg && (
                            <div className="text-white/35 text-xs truncate">
                              {lastMsg.sender_type === "admin" ? "You: " : ""}{lastMsg.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {conv.lastMessageTime && (
                          <span className="text-white/25 text-[10px]">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                            style={{ background: "#4895EF" }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden" : "flex"} lg:flex`}>
          {!selectedUserId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(72,149,239,0.08)", border: "1px solid rgba(72,149,239,0.12)" }}>
                <MessageCircle size={28} className="text-blue-400/50" />
              </div>
              <p className="text-white/30 text-sm">Select a conversation to reply</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                  {selectedConversation?.profile.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{selectedConversation?.profile.full_name}</div>
                  <div className="text-white/35 text-xs">{selectedConversation?.profile.email}</div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {threadMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-white/25 text-sm">No messages yet</p>
                  </div>
                ) : (
                  threadMessages.map((msg) => {
                    const isAdmin = msg.sender_type === "admin";
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        {!isAdmin && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-xs font-bold text-white"
                            style={{ background: "linear-gradient(135deg,#1B5FBE,#4895EF)" }}>
                            {selectedConversation?.profile.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="max-w-[75%]">
                          <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                            style={{
                              background: isAdmin ? "linear-gradient(135deg,#7C1B1B,#EF4444)" : "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.9)",
                              borderRadius: isAdmin ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            }}>
                            {msg.message}
                          </div>
                          <p className={`text-white/25 text-[10px] mt-1 ${isAdmin ? "text-right" : ""}`}>
                            {isAdmin ? "Support" : selectedConversation?.profile.full_name} ·{" "}
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {isAdmin && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center ml-2 flex-shrink-0 mt-1"
                            style={{ background: "linear-gradient(135deg,#7C1B1B,#EF4444)" }}>
                            <Headphones size={13} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-white/[0.05]">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Reply to ${selectedConversation?.profile.full_name}...`}
                    className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-white/25"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                  <button type="submit" disabled={isPending || !input.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                    style={{ background: input.trim() ? "linear-gradient(135deg,#7C1B1B,#EF4444)" : "rgba(255,255,255,0.06)" }}>
                    <Send size={16} className="text-white" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
