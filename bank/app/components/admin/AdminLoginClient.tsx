"use client";
import { useState, useTransition } from "react";
import { Shield, Eye, EyeOff, AlertCircle, Lock } from "lucide-react";
import { adminLogin } from "@/app/actions/adminAuth";
import { useRouter } from "next/navigation";

export default function AdminLoginClient({ locale }: { locale: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await adminLogin(username, password);
      if (result.error) { setError(result.error); return; }
      router.push(`/${locale}/admin`);
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0e" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #EF4444, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #7C1B1B, #EF4444)", boxShadow: "0 0 40px rgba(239,68,68,0.3)" }}>
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-sora font-bold text-white text-2xl">Admin Portal</h1>
          <p className="text-white/35 text-sm mt-1">Trust Bank — Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">Username</label>
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Admin username"
                autoComplete="username"
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none placeholder-white/20"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !username || !password}
              className="w-full py-3 rounded-xl font-sora font-semibold text-sm text-white transition-all"
              style={{ background: isPending ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg,#7C1B1B,#EF4444)" }}>
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-white/20 text-xs">
          <Lock size={11} />
          <span>Restricted to authorized personnel only</span>
        </div>
      </div>
    </div>
  );
}
