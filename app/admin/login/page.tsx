"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
    } else {
      setError("Senha incorreta.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8">
            <Lock className="h-6 w-6 text-white/60" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-white">Admin</h1>
          <p className="mt-1 text-sm text-white/40">Acesso restrito</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#111111] p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-white/50">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 pr-11 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white text-[14px] font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
