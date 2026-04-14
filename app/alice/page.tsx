"use client";

import { useState } from "react";
import { Images, Play, UserCheck, Heart } from "lucide-react";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import SubscribeBox from "@/components/SubscribeBox";
import PlansSection from "@/components/PlansSection";
import ContentFeed from "@/components/ContentFeed";
import PixModal from "@/components/PixModal";

// ─── Dados da Alice — edite aqui ─────────────────────────────────────────────

const CREATOR = {
  name: "Alice Montenegro",
  username: "@alicemontegro",
  bio: "Só fica quem tem coragem de desvendar cada segredinho da sua Branquinha.... vem? 😜",
  profileImg: "/img/Coloca_a_mulher_202604111310.png",   // troque pelo caminho da foto da Alice
  coverImg: "/img/Apenas_coloca_ela_202604111254 (1).png",      // troque pelo caminho da capa da Alice
  stats: [
    { icon: Images,    value: "159" },
    { icon: Play,      value: "626" },
    { icon: UserCheck, value: "53" },
    { icon: Heart,     value: "364.6K" },
  ],
};

const PLANS = [
  { id: "monthly",   label: "1 Mês (26% off)",    price: "R$ 13,87", amount: 13.87 },
  { id: "quarterly", label: "3 meses (42% off)",   price: "R$ 37,87", amount: 37.87 },
  { id: "lifetime",  label: "Vitalício (50% off)", price: "R$ 87,98", amount: 87.98 },
];

const FEED_ITEMS = [
  { id: "1", isFree: false, likes: 124, comments: 18, image: "/img/foto_1.png" },
  { id: "2", isFree: false, likes: 341, comments: 47, image: "/img/foto_2.png" },
];

const DEFAULT_PLAN = { label: PLANS[0].label, amount: PLANS[0].amount };

// ─────────────────────────────────────────────────────────────────────────────

interface SelectedPlan {
  label: string;
  amount: number;
}

export default function Alice() {
  const [plan, setPlan] = useState<SelectedPlan | null>(null);

  const openModal = (label: string, amount: number) => setPlan({ label, amount });
  const closeModal = () => setPlan(null);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-12">
        <div className="mx-auto flex max-w-[480px] flex-col gap-3 px-3 py-4 pb-12">
          <ProfileCard
            name={CREATOR.name}
            username={CREATOR.username}
            bio={CREATOR.bio}
            stats={CREATOR.stats}
            profileImg={CREATOR.profileImg}
            coverImg={CREATOR.coverImg}
          />

          <SubscribeBox
            creatorName={CREATOR.name}
            onSubscribe={() => openModal(DEFAULT_PLAN.label, DEFAULT_PLAN.amount)}
            onLogin={() => openModal(DEFAULT_PLAN.label, DEFAULT_PLAN.amount)}
          />

          <PlansSection
            plans={PLANS}
            onSelect={(label, amount) => openModal(label, amount)}
          />

          <ContentFeed
            creatorName={CREATOR.name}
            creatorHandle={CREATOR.username}
            profileImg={CREATOR.profileImg}
            feedItems={FEED_ITEMS}
            onLockedClick={() => openModal(DEFAULT_PLAN.label, DEFAULT_PLAN.amount)}
          />
        </div>
      </main>

      <PixModal
        isOpen={plan !== null}
        onClose={closeModal}
        planLabel={plan?.label ?? ""}
        planAmount={plan?.amount ?? 0}
        creatorName={CREATOR.name}
        creatorHandle={CREATOR.username}
        profileImg={CREATOR.profileImg}
        creatorSlug="alice"
      />
    </>
  );
}
