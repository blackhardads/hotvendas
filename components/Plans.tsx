"use client";

import { Check, Zap, Star, Crown, Infinity } from "lucide-react";

const PLANS = [
  {
    id: "weekly",
    name: "Semanal",
    priceUsd: 3.51,
    interval: "semana",
    popular: false,
    savePct: null,
    icon: Zap,
    featureKeys: [
      "Acesso ao vault desbloqueado",
      "Prévias privadas",
      "Feed VIP após pagamento",
    ],
  },
  {
    id: "monthly",
    name: "Mensal",
    priceUsd: 5.03,
    interval: "mês",
    popular: true,
    savePct: null,
    icon: Star,
    featureKeys: [
      "Acesso ao vault desbloqueado",
      "Prévias privadas",
      "Feed VIP após pagamento",
      "Chat privado",
      "WhatsApp VIP (add-on)",
    ],
  },
  {
    id: "quarterly",
    name: "Trimestral",
    priceUsd: 33.87,
    interval: "trimestre",
    popular: false,
    savePct: 20,
    icon: Crown,
    featureKeys: [
      "Acesso ao vault desbloqueado",
      "Prévias privadas",
      "Feed VIP após pagamento",
      "Chat privado",
      "Pedidos especiais",
      "WhatsApp VIP incluído",
    ],
  },
  {
    id: "lifetime",
    name: "Vitalício",
    priceUsd: 65.98,
    interval: null,
    popular: false,
    savePct: null,
    icon: Infinity,
    featureKeys: [
      "Acesso vitalício ao vault",
      "Prévias privadas",
      "Feed VIP após pagamento",
      "Chat privado",
      "Pedidos especiais",
      "Chamada privada incluída",
      "WhatsApp VIP incluído",
    ],
  },
];

export default function Plans({ onSelect }: { onSelect: (plan: (typeof PLANS)[0]) => void }) {
  return (
    <section id="plans" className="mx-auto mt-14 w-full max-w-4xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2
          className="text-[22px] font-semibold tracking-[-0.04em] text-white sm:text-[28px]"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Escolha seu acesso Nicole VIP
        </h2>
        <p className="mt-2 text-[17px] text-white/55">
          Escolha o plano, prossiga com o checkout e aguarde a confirmação para liberar o acesso VIP.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelect} />
        ))}
      </div>

      {/* WhatsApp add-on note */}
      <div className="mt-6 rounded-2xl border border-[#e89c30]/20 bg-[#e89c30]/5 p-4">
        <p className="text-center text-[15px] text-white/70">
          <span className="font-semibold text-[#e89c30]">WhatsApp VIP</span> —{" "}
          Adicione o WhatsApp VIP depois do seu plano para ter contato mais próximo,
          drops diretos e respostas privadas mais rápidas.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  onSelect,
}: {
  plan: (typeof PLANS)[0];
  onSelect: (plan: (typeof PLANS)[0]) => void;
}) {
  const Icon = plan.icon;
  const isLifetime = plan.interval === null;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
        plan.popular
          ? "border-[#e89c30] bg-gradient-to-b from-[#e89c30]/10 to-[#111111] glow"
          : "border-white/10 bg-[#111111]"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[#e89c30] px-3 py-1 text-[11px] font-bold text-black uppercase tracking-[0.06em]">
            Popular
          </span>
        </div>
      )}

      {/* Save badge */}
      {plan.savePct && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-[#e89c30] px-3 py-1 text-[11px] font-bold text-black uppercase tracking-[0.06em]">
            -{plan.savePct}%
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#e89c30]/15 text-[#e89c30]">
        <Icon className="h-5 w-5" />
      </div>

      {/* Plan name */}
      <h3
        className="text-[16px] font-semibold tracking-[-0.03em] text-white"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mt-3 flex items-end gap-1">
        <span className="text-[28px] font-bold leading-none tracking-[-0.05em] text-white">
          ${plan.priceUsd.toFixed(2)}
        </span>
        {plan.interval && (
          <span className="mb-0.5 text-[15px] text-white/45">/{plan.interval}</span>
        )}
        {isLifetime && (
          <span className="mb-0.5 text-[12px] font-medium text-[#e89c30]">único</span>
        )}
      </div>

      {isLifetime && (
        <p className="mt-1 text-[11px] font-medium text-[#e89c30]/80">
          Um pagamento, acesso vitalício
        </p>
      )}

      {/* Divider */}
      <div className="my-5 h-px w-full bg-white/8" />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-2.5">
        {plan.featureKeys.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[15px] text-white/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#e89c30]" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        className={`mt-6 block h-11 w-full rounded-xl text-center text-sm font-semibold transition-all ${
          plan.popular
            ? "bg-[#e89c30] text-black hover:bg-[#e89c30]/90"
            : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {isLifetime ? "Acesso vitalício" : "Assinar agora"}
      </button>
    </div>
  );
}
