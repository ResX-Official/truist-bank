"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    router.push(`/${locale}/dashboard`);
    router.refresh();
  };

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

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wide">
              {t("email")}
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wide">
                {t("password")}
              </label>
              <button type="button" className="text-blue-light text-xs hover:underline">
                {t("forgot")}
              </button>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Lock size={15} className="text-white/30 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-sora font-semibold text-sm flex items-center justify-center gap-2"
          >
            {loading ? tCommon("loading") : t("submit")}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-center text-white/35 text-sm">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/register`} className="text-blue-light hover:underline font-medium">
            {t("register")}
          </Link>
        </p>
      </div>

      {/* Demo hint */}
      <p className="text-center text-white/20 text-xs mt-6">
        Demo: use any Supabase user credentials
      </p>
    </div>
  );
}
