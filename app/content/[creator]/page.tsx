"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Lock, LogOut, Loader2, Heart } from "lucide-react";

interface ContentBlock {
  id: string;
  type: "image" | "video";
  title: string;
  value: string;
  display_order: number;
  reactions: number;
  userReacted: boolean;
}

const CREATOR_LABELS: Record<string, string> = {
  emilly:   "Emilly Faria",
  yasmin:   "Yasmin Torrez",
  yasminof: "Yasmin Torrez",
  alice:    "Alice Montenegro",
  of:       "Emilly Faria",
};

const CREATOR_PROFILE: Record<string, string> = {
  emilly:   "/img/profile-img.png",
  of:       "/img/profile-img.png",
  yasmin:   "/img/coloca_pra_primeira_202604102110.png",
  yasminof: "/img/coloca_pra_primeira_202604102110.png",
  alice:    "/img/Coloca_a_mulher_202604111310.png",
};

export default function ContentPage() {
  const { creator } = useParams<{ creator: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadContent = useCallback(async (accessToken: string) => {
    const res = await fetch(`/api/content/${creator}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 403) { setErrorMsg("Você não tem uma compra válida para este conteúdo."); setLoading(false); return; }
    if (!res.ok) { setErrorMsg("Erro ao carregar conteúdo. Tente novamente."); setLoading(false); return; }
    const data = await res.json();
    setBlocks(data.blocks ?? []);
    setAuthorized(true);
    setLoading(false);
  }, [creator]);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabaseBrowser.auth.getUser();
      if (!userData.user) { router.replace(`/login?redirect=/content/${creator}`); return; }
      const { data: sessionData } = await supabaseBrowser.auth.getSession();
      const t = sessionData.session?.access_token;
      if (!t) { router.replace(`/login?redirect=/content/${creator}`); return; }
      setToken(t);
      await loadContent(t);
    }
    init();
  }, [creator, router, loadContent]);

  async function toggleReaction(blockId: string) {
    if (!token) return;
    const res = await fetch("/api/content/react", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ blockId }),
    });
    if (!res.ok) return;
    const { reacted } = await res.json();
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, userReacted: reacted, reactions: b.reactions + (reacted ? 1 : -1) }
          : b
      )
    );
  }

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#e89c30]" />
          <p className="text-sm text-white/40">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <Lock className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-[20px] font-bold text-white">Acesso negado</h2>
          <p className="mt-2 text-sm text-white/50">{errorMsg}</p>
          <button onClick={() => router.replace("/")} className="mt-6 rounded-xl bg-white/8 px-6 py-3 text-sm font-semibold text-white hover:bg-white/12 transition">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  const creatorLabel = CREATOR_LABELS[creator] ?? creator;
  const profileImg = CREATOR_PROFILE[creator] ?? "/img/profile-img.png";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="border-b border-white/8 px-4 py-3">
        <div className="mx-auto max-w-[600px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#e89c30]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profileImg} alt={creatorLabel} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#e89c30]/70">Área VIP</p>
              <h1 className="text-[15px] font-semibold text-white leading-tight">{creatorLabel}</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-[13px] text-white/50 hover:text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </div>

      {/* Content feed */}
      <div className="mx-auto max-w-[600px] px-4 py-6 flex flex-col gap-5">
        {blocks.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[#111111] p-10 text-center">
            <p className="text-white/30 text-sm">Conteúdo exclusivo em breve!</p>
          </div>
        ) : (
          blocks.map((block) => (
            <div key={block.id} className="rounded-2xl overflow-hidden border border-white/8 bg-[#111111]">
              {/* Media */}
              {block.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={block.value} alt={block.title} className="w-full object-cover" />
              ) : (
                <video src={block.value} controls playsInline className="w-full" />
              )}

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <p className="text-[15px] font-semibold text-white">{block.title}</p>

                {/* Heart reaction */}
                <button
                  onClick={() => toggleReaction(block.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition shrink-0 ${
                    block.userReacted
                      ? "bg-red-500/15 text-red-400"
                      : "bg-white/5 text-white/40 hover:text-white/70"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${block.userReacted ? "fill-red-400" : ""}`} />
                  {block.reactions > 0 && <span>{block.reactions}</span>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
