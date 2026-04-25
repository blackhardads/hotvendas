"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

function useCountdown(targetSeconds: number) {
  const [secs, setSecs] = useState(targetSeconds);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return { d, h, m, s };
}

export default function SubscribeBox({
  onSubscribe,
  onLogin,
  creatorName = "Milly",
}: {
  onSubscribe: () => void;
  onLogin: () => void;
  creatorName?: string;
}) {
  const { d, h, m, s } = useCountdown(1 * 24 * 3600 + 4 * 3600 + 59 * 60 + 10);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#e89c30]" />
          <p className="text-[17px] font-semibold text-black">Oferta de assinatura</p>
        </div>
        <p className="mt-0.5 text-[12px] text-gray-600">
          Termina em {d} dia{d !== 1 ? "s" : ""}, {h}h {m}m {String(s).padStart(2, "0")}s
        </p>
      </div>

      {/* Description box */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
        <p className="text-[15px] text-black">
          Acesso especial com atualizações diárias, conversas reservadas e íntimas.
        </p>
      </div>

      {/* Main CTA with save badge */}
      <div className="relative">
        {/* "Economize" badge */}
        <span className="absolute -top-2.5 left-3 z-10 rounded-full bg-[#4ade80] px-2.5 py-0.5 text-[13px] font-bold text-black">
          Economize 26%
        </span>
        <button
          onClick={onSubscribe}
          className="w-full rounded-2xl py-4 text-[16px] font-bold text-black transition hover:opacity-90"
          style={{
            background: "linear-gradient(90deg, #e89c30 0%, #f5bc6a 60%, #f8c97e 100%)",
          }}
        >
          Assinar agora R$ 13,87
        </button>
      </div>

      {/* Secondary button */}
      <button
        onClick={onLogin}
        className="w-full rounded-2xl border border-gray-200 bg-gray-100 py-3 text-[16px] font-semibold text-black transition hover:bg-gray-200 hover:text-black"
      >
        ★ Ligar agora para Vitória?
      </button>

      {/* Original price */}
      <p className="text-right text-[11px] text-gray-600">
        Preço original <span className="line-through">R$ 16,47</span>
      </p>
    </div>
  );
}
