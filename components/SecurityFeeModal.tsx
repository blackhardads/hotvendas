"use client";

import { X, Check, Copy, RefreshCw, Loader2, Lock } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "creating" | "waiting" | "completed" | "failed" | "expired";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: string;
  creator: string;
  plan: string;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(data)}`;
}

export default function SecurityFeeModal({
  isOpen,
  onClose,
  sale,
  creator,
  plan,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      abortRef.current = true;
      setStatus("idle");
      setPixCode(null);
      setIdentifier(null);
      setCopied(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const createCharge = useCallback(async () => {
    abortRef.current = false;
    setStatus("creating");
    setPixCode(null);
    setIdentifier(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 6.87,
          description: `Taxa de Segurança — Milly Privacy`,
          creator: "Security Fee",
        }),
      });

      const data = await res.json();

      if (!res.ok || abortRef.current) {
        if (!abortRef.current) {
          setStatus("failed");
          setErrorMsg(data.error ?? "Erro ao gerar pagamento PIX.");
        }
        return;
      }

      setPixCode(data.pix_code);
      setIdentifier(data.identifier);
      setStatus("waiting");
    } catch {
      if (!abortRef.current) {
        setStatus("failed");
        setErrorMsg("Erro de conexão. Tente novamente.");
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && status === "idle") createCharge();
  }, [isOpen, status, createCharge]);

  // Poll payment status every 5s
  useEffect(() => {
    if (status !== "waiting" || !identifier) return;

    const poll = async () => {
      if (abortRef.current) return;
      try {
        const res = await fetch(`/api/payment/status/${identifier}`);
        const data = await res.json();
        if (abortRef.current) return;
        if (data.status === "completed") setStatus("completed");
        else if (data.status === "failed") { setStatus("failed"); setErrorMsg("Pagamento recusado."); }
        else if (data.status === "expired") setStatus("expired");
      } catch { /* ignore */ }
    };

    poll();
    const id = setInterval(poll, 5_000);
    return () => clearInterval(id);
  }, [status, identifier]);

  // When payment completes, redirect to register
  useEffect(() => {
    if (status === "completed" && identifier) {
      setTimeout(() => {
        const params = new URLSearchParams({
          sale,
          creator,
          plan,
        });
        router.push(`/register?${params.toString()}`);
      }, 1500);
    }
  }, [status, identifier, sale, creator, plan, router]);

  const handleCopy = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    } catch { /* ignore */ }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0f0f0f] text-white sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e89c30]/80">TAXA DE SEGURANÇA</p>
            <h2 className="text-[18px] font-semibold tracking-[-0.04em] text-white">Pagamento PIX</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/8 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[82vh] overflow-y-auto px-5 pb-6 pt-4">

          {/* Amount */}
          <div className="rounded-[20px] border border-white/8 bg-[#181818] p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#e89c30]/15 flex items-center justify-center">
                <Lock className="h-8 w-8 text-[#e89c30]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[20px] font-semibold tracking-[-0.04em] text-white leading-tight">Taxa de Segurança</p>
                <p className="text-[13px] text-white/45">Verificação e proteção</p>
                <div className="mt-3 rounded-xl bg-[#111111] px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e89c30]">VALOR</p>
                  <p className="mt-0.5 text-[26px] font-semibold tracking-[-0.05em] text-white leading-none">
                    {formatBRL(6.87)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/80">Será devolvido após validação</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-[20px] border border-white/8 bg-[#181818] p-4">
            <h3 className="text-[15px] font-semibold text-white">Forma de pagamento</h3>

            {/* Creating */}
            {status === "creating" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-9 w-9 animate-spin text-[#e89c30]" />
                <p className="mt-4 text-sm text-white/55">Gerando pagamento PIX...</p>
              </div>
            )}

            {/* Failed / expired */}
            {(status === "failed" || status === "expired") && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <p className="text-sm text-white/60">
                  {status === "expired" ? "PIX expirado." : (errorMsg ?? "Erro ao gerar o PIX.")}
                </p>
                <button
                  onClick={createCharge}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" /> Tentar novamente
                </button>
              </div>
            )}

            {/* Completed — redirect will happen automatically */}
            {status === "completed" && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e89c30]/15">
                  <Check className="h-7 w-7 text-[#e89c30]" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-[17px] font-semibold text-white">Pagamento confirmado!</p>
                <p className="mt-1 text-sm text-white/50">Redirecionando para criar sua conta...</p>
                <Loader2 className="mt-3 h-4 w-4 animate-spin text-white/30" />
              </div>
            )}

            {/* Waiting — QR + copy */}
            {status === "waiting" && pixCode && (
              <div className="mt-4 text-center">
                <p className="text-[12px] font-semibold text-[#e89c30]">PIX gerado com sucesso</p>
                <h4 className="mt-2 text-[17px] font-semibold text-white">Escaneie o QR Code</h4>

                <div className="mt-4 flex justify-center">
                  <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-[14px] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl(pixCode)} alt="QR Code PIX" className="h-full w-full object-contain" />
                  </div>
                </div>

                <p className="mt-4 text-[14px] font-semibold text-white">Ou copie o código PIX</p>
                <div className="mt-2 rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2.5 text-left">
                  <p className="line-clamp-2 break-all text-[12px] text-white/55">{pixCode}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] text-[14px] font-semibold text-white transition hover:bg-[#2563eb]"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Código copiado!" : "Copiar código PIX"}
                </button>

                <div className="mt-4 rounded-2xl border border-white/8 bg-[#181818] p-3.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e89c30]/40 bg-[#1d1308] text-[10px] font-bold text-[#e89c30]">
                      i
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white/80">
                        Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para concluir o pagamento da taxa.
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/45">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Aguardando confirmação do pagamento...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
