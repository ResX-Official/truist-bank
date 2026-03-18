"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ensureDefaultAccounts } from "@/app/actions/accounts";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("passwordShort"));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      // Show the actual Supabase error; fall back to generic message
      const msg = authError.message?.trim();
      setError(msg || t("error"));
      setLoading(false);
      return;
    }

    // Ensure accounts exist (fire-and-forget — non-fatal)
    ensureDefaultAccounts().catch(() => {});
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push(`/${locale}/dashboard`), 1500);
  };

  if (success) {
    return (
      <div className="relative z-10 w-full max-w-md px-4 text-center">
        <div
          className="rounded-2xl p-10"
          style={{
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(34,197,94,0.12)" }}>
            <User size={24} className="text-green-400" />
          </div>
          <h2 className="font-sora font-bold text-white text-xl mb-2">{t("success")}</h2>
          <p className="text-white/40 text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1B5FBE, #4895EF)" }}
          >
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-sora font-bold text-white text-xl">Truist Bank</span>
        </Link>
        <h1 className="font-sora font-bold text-white text-2xl mb-2">{t("title")}</h1>
        <p className="text-white/40 text-sm">{t("subtitle")}</p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wide">
              {t("name")}
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <User size={15} className="text-white/30 flex-shrink-0" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25"
                placeholder="John Smith"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wide">
              {t("email")}
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Mail size={15} className="text-white/30 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wide">
              {t("password")}
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Lock size={15} className="text-white/30 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wide">
              {t("confirm")}
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Lock size={15} className="text-white/30 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-sora font-semibold text-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? tCommon("loading") : t("submit")}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-center text-white/35 text-sm">
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="text-blue-light hover:underline font-medium">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
