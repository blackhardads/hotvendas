"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const DEFAULT_PLANS = [
  { id: "monthly",   label: "1 Mês (26% off)",    price: "R$ 13,87", amount: 13.87 },
  { id: "quarterly", label: "3 meses (42% off)",   price: "R$ 33,87", amount: 33.87 },
  { id: "lifetime",  label: "Vitalício (50% off)", price: "R$ 65,98", amount: 65.98 },
];

interface Plan {
  id: string;
  label: string;
  price: string;
  amount: number;
}

export default function PlansSection({
  onSelect,
  plans = DEFAULT_PLANS,
}: {
  onSelect: (label: string, amount: number) => void;
  plans?: Plan[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 transition hover:bg-gray-50"
      >
        <p className="text-[17px] font-semibold text-black">Assinaturas</p>
        <ChevronUp
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {/* Plan rows */}
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {plans.map((plan) => (
          <button
  key={plan.id}
  onClick={() => onSelect(plan.label, plan.amount)}
  className="text-black flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-left font-semibold transition hover:opacity-90 overflow-hidden relative bg-[length:200%_100%] animate-gradient-x"
  style={{
    background: "linear-gradient(90deg, #ffb163, #f5bc6a, #f8c97e, #e89c30)",
    color: "#000",
  }}
>
  <span className="text-[16px] font-semibold">{plan.label}</span>
  <span className="text-[16px] font-bold">{plan.price}</span>
</button>
          ))}
        </div>
      )}
    </div>
  );
}
