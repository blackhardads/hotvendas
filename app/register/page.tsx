"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sale = searchParams.get("sale") ?? "";
  const creator = searchParams.get("creator") ?? "";
  const plan = searchParams.get("plan") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // If already logged in, go straight to content
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (data.user && creator) {
        router.replace(`/content/${creator}`);
      }
    });
  }, [creator, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabaseBrowser.auth.signUp({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setError("Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      // Associate the purchase with this user
      if (sale && creator) {
        await fetch("/api/user/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, saleIdentifier: sale, creator, plan }),
        });
      }

      setDone(true);
      setTimeout(() => {
        router.replace(`/content/${creator}`);
      }, 1500);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e89c30]/15">
          <Check className="h-8 w-8 text-[#e89c30]" strokeWidth={2.5} />
        </div>
        <p className="text-[18px] font-semibold text-white">Conta criada!</p>
        <p className="text-sm text-white/50">Redirecionando para seu conteúdo...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-white/60">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#e89c30]/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-white/60">Senha</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 pr-11 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#e89c30]/50"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-white/60">Confirmar senha</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 pr-11 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#e89c30]/50"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#e89c30] text-[15px] font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Criar minha conta"
        )}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e89c30]/15">
            <Lock className="h-6 w-6 text-[#e89c30]" />
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.04em] text-white">
            Crie sua conta
          </h1>
          <p className="mt-2 text-[14px] text-white/50">
            Pagamento confirmado! Registre-se para acessar seu conteúdo exclusivo.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#111111] p-6">
          <Suspense fallback={<div className="py-10 text-center text-white/40 text-sm">Carregando...</div>}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-[12px] text-white/25">
          Ao criar sua conta você concorda com os termos de uso.
        </p>
      </div>
    </div>
  );
}
