"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import SecurityFeeModal from "@/components/SecurityFeeModal";

function SecurityFeeContent() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sale = searchParams.get("sale") ?? "";
  const creator = searchParams.get("creator") ?? "";
  const plan = searchParams.get("plan") ?? "";

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#e89c30]/20 blur-xl rounded-full" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e89c30]/15 border border-[#e89c30]/30">
              <Lock className="h-8 w-8 text-[#e89c30]" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[24px] font-bold tracking-[-0.04em] text-white">
            Taxa de Segurança
          </h1>
          <p className="mt-3 text-[15px] font-medium text-white/80">
            Será aplicada uma taxa de segurança no valor de{" "}
            <span className="text-[#e89c30] font-bold">R$ 6,87</span>
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-white/8 bg-[#111111] p-6 space-y-6 mb-6">
          {/* Description */}
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-[14px] text-white/70 leading-relaxed">
                Essa taxa existe como medida de proteção e verificação, especialmente por se tratar de conteúdo sensível/explicitamente restrito, garantindo a integridade da transação e evitando acessos indevidos.
              </p>
            </div>

            {/* Important note */}
            <div className="rounded-xl border border-[#e89c30]/20 bg-[#e89c30]/5 p-4">
              <p className="text-[12px] font-semibold text-[#e89c30] uppercase tracking-[0.1em] mb-1">
                ℹ️ Importante
              </p>
              <p className="text-[13px] text-white/70 leading-relaxed">
                O valor de <span className="font-semibold text-white">R$ 6,87</span> será devolvido integralmente ao usuário logo após a validação do pagamento, sem nenhum custo adicional.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/8" />

          {/* Info badges */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e89c30]/20 text-[10px] font-bold text-[#e89c30] mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Conteúdo protegido</p>
                <p className="text-[12px] text-white/50">Acesso seguro garantido</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e89c30]/20 text-[10px] font-bold text-[#e89c30] mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Transação verificada</p>
                <p className="text-[12px] text-white/50">Sistema de validação anti-fraude</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e89c30]/20 text-[10px] font-bold text-[#e89c30] mt-0.5">
                ✓
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Devolução total</p>
                <p className="text-[12px] text-white/50">Reembolso após validação</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex h-[50px] items-center justify-center gap-2 rounded-xl bg-[#e89c30] text-[15px] font-semibold text-black transition hover:opacity-90 active:scale-95"
        >
          Continuar para cadastro
        </button>

        {/* Security Fee Modal */}
        <SecurityFeeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          sale={sale}
          creator={creator}
          plan={plan}
        />

        {/* Footer text */}
        <p className="mt-6 text-center text-[12px] text-white/25">
          Você compreendeu e concorda com a taxa de segurança
        </p>
      </div>
    </div>
  );
}

export default function SecurityFeePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#e89c30]" />
        </div>
      }
    >
      <SecurityFeeContent />
    </Suspense>
  );
}
