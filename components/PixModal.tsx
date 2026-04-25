"use client";

import { X, Check, Copy, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fbqEvent } from "@/components/MetaPixel";
import DeliveryChoiceModal from "@/components/DeliveryChoiceModal";

const FEATURES = [
  "Acesso imediato ao conteúdo protegido",
  "Chat privado e pedidos personalizados",
  "Liberação VIP automática após a aprovação",
];

type Status = "idle" | "creating" | "waiting" | "completed" | "failed" | "expired";
type PaymentMethod = "none" | "pix" | "card";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planLabel: string;
  planAmount: number;
  creatorName?: string;
  creatorHandle?: string;
  profileImg?: string;
  deliverableLink?: string;
  creatorSlug?: string;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PixModal({
  isOpen,
  onClose,
  planLabel,
  planAmount,
  creatorName = "Vitória Lima",
  creatorHandle = "@vitorialima5",
  profileImg = "img/WhatsApp Image 2026-04-25 at 11.25.40 (1).jpeg",
  creatorSlug = "vitória",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none");
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeliveryChoice, setShowDeliveryChoice] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      abortRef.current = true;
      setStatus("idle");
      setPaymentMethod("none");
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
          amount: planAmount,
          description: `Assinatura ${planLabel} — Milly Privacy`,
          creator: creatorName,
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
      fbqEvent("InitiateCheckout", { value: planAmount, currency: "BRL", content_name: planLabel });
    } catch {
      if (!abortRef.current) {
        setStatus("failed");
        setErrorMsg("Erro de conexão. Tente novamente.");
      }
    }
  }, [planAmount, planLabel]);

  const handleSelectPix = useCallback(() => {
    setPaymentMethod("pix");
  }, []);

  useEffect(() => {
    if (isOpen && paymentMethod === "pix" && status === "idle") {
      createCharge();
    }
  }, [isOpen, paymentMethod, status, createCharge]);

  // Poll payment status every 5s
  useEffect(() => {
    if (status !== "waiting" || !identifier) return;

    const poll = async () => {
      if (abortRef.current) return;
      try {
        const res = await fetch(`/api/payment/status/${identifier}?page=${encodeURIComponent(creatorName)}&plan=${encodeURIComponent(planLabel)}`);
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

  // When payment completes, fire Purchase event then show delivery choice
  useEffect(() => {
    if (status === "completed" && identifier) {
      fbqEvent("Purchase", { value: planAmount, currency: "BRL", content_name: planLabel });
      setTimeout(() => {
        setShowDeliveryChoice(true);
      }, 1500);
    }
  }, [status, identifier, planAmount, planLabel]);

  const handleDeliveryChoice = (deliveryMethod: "site" | "telegram") => {
    if (deliveryMethod === "site") {
      const params = new URLSearchParams({
        sale: identifier || "",
        creator: creatorSlug,
        plan: planLabel,
      });
      setShowDeliveryChoice(false);
      setTimeout(() => {
        router.push(`/security-fee?${params.toString()}`);
      }, 300);
    }
  };

  const handleCopy = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    } catch { /* ignore */ }
  };

  if (!isOpen) return null;

  const handleCloseDeliveryChoice = () => {
    setShowDeliveryChoice(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-t-[28px] border border-gray-200 bg-white text-black sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e89c30]">SYNCPAY</p>
            <h2 className="text-[18px] font-semibold tracking-[-0.04em] text-black">Pagamento PIX</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[82vh] overflow-y-auto px-5 pb-6 pt-4">

          {/* Profile + amount */}
          <div className="rounded-[20px] border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full border-[3px] border-gray-50 bg-gradient-to-br from-[#e89c30]/40 to-[#1a1208] flex items-center justify-center">
  <img
    src={profileImg}
    alt="Avatar"
    className="h-full w-full object-cover"
  />
</div>
              <div className="flex-1 min-w-0">
                <p className="text-[20px] font-semibold tracking-[-0.04em] text-black leading-tight">{creatorName}</p>
                <p className="text-[13px] text-gray-500">{creatorHandle}</p>
                <div className="mt-3 rounded-xl bg-white border border-gray-200 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e89c30]">VALOR</p>
                  <p className="mt-0.5 text-[26px] font-semibold tracking-[-0.05em] text-black leading-none">
                    {formatBRL(planAmount)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-600">{planLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits + payment */}
          <div className="mt-4 rounded-[20px] border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-[15px] font-semibold text-black">Beneficios exclusivos</h3>
            <ul className="mt-3 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[14px] text-gray-700">
                  <Check className="h-4 w-4 shrink-0 text-[#e89c30]" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-200" />
            <h3 className="text-[15px] font-semibold text-black">Formas de pagamento</h3>

            {/* Payment method selection */}
            {paymentMethod === "none" && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSelectPix}
                  className="w-full rounded-2xl border-2 border-[#e89c30] px-5 py-4 text-[16px] font-bold text-black transition hover:shadow-[0_0_20px_rgba(232,156,48,0.4)]"
                  style={{ background: "linear-gradient(90deg, #ffb163, #f5bc6a, #f8c97e, #e89c30)" }}
                >
                  ✓ PIX Instantâneo
                </button>
              </div>
            )}

            {/* Creating */}
            {paymentMethod === "pix" && status === "creating" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-9 w-9 animate-spin text-[#e89c30]" />
                <p className="mt-4 text-sm text-gray-600">Gerando pagamento PIX...</p>
              </div>
            )}

            {/* Failed / expired */}
            {paymentMethod === "pix" && (status === "failed" || status === "expired") && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <p className="text-sm text-gray-600">
                  {status === "expired" ? "PIX expirado." : (errorMsg ?? "Erro ao gerar o PIX.")}
                </p>
                <button
                  onClick={createCharge}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  <RefreshCw className="h-4 w-4" /> Tentar novamente
                </button>
              </div>
            )}

            {/* Completed — redirect will happen automatically */}
            {paymentMethod === "pix" && status === "completed" && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e89c30]/15">
                  <Check className="h-7 w-7 text-[#e89c30]" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-[17px] font-semibold text-black">Pagamento confirmado!</p>
                <p className="mt-1 text-sm text-gray-500">Redirecionando para criar sua conta...</p>
                <Loader2 className="mt-3 h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}

            {/* Waiting — copy PIX code */}
            {paymentMethod === "pix" && status === "waiting" && pixCode && (
              <div className="mt-4 text-center">
                <p className="text-[12px] font-semibold text-[#e89c30]">PIX gerado com sucesso</p>
                <h4 className="mt-4 text-[17px] font-semibold text-black">Copie o código PIX</h4>
                <div className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-left">
                  <p className="line-clamp-2 break-all text-[12px] text-gray-600">{pixCode}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] text-[14px] font-semibold text-white transition hover:bg-[#2563eb]"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Código copiado!" : "Copiar código PIX"}
                </button>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e89c30] bg-[#e89c30]/10 text-[10px] font-bold text-[#e89c30]">
                      i
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-700">
                        Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para concluir o pagamento.
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-gray-500">
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

      <DeliveryChoiceModal
        isOpen={showDeliveryChoice}
        onClose={handleCloseDeliveryChoice}
        onTelegram={() => handleDeliveryChoice("telegram")}
        onSite={() => handleDeliveryChoice("site")}
        creatorSlug={creatorSlug}
      />
    </div>
  );
}
