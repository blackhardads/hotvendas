"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import SubscribeBox from "@/components/SubscribeBox";
import PlansSection from "@/components/PlansSection";
import ContentFeed from "@/components/ContentFeed";
import PixModal from "@/components/PixModal";

interface SelectedPlan {
  label: string;
  amount: number;
}

export default function Home() {
  const [plan, setPlan] = useState<SelectedPlan | null>(null);

  const openModal = (label: string, amount: number) =>
    setPlan({ label, amount });

  const closeModal = () => setPlan(null);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-12">
        <div className="mx-auto flex max-w-[480px] flex-col gap-3 px-3 py-4 pb-12">
          <ProfileCard />

          <SubscribeBox
            onSubscribe={() => openModal("1 Mês", 2)}
            onLogin={() => openModal("1 Mês", 2)}
          />

          <PlansSection onSelect={(label, amount) => openModal(label, amount)} />

          <ContentFeed onLockedClick={() => openModal("1 Mês", 2)} />
        </div>
      </main>

      <PixModal
        isOpen={plan !== null}
        onClose={closeModal}
        planLabel={plan?.label ?? ""}
        planAmount={plan?.amount ?? 0}
        creatorSlug="emilly"
      />
    </>
  );
}
