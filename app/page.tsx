"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
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
  const router = useRouter();
  const [plan, setPlan] = useState<SelectedPlan | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function checkLocation() {
      try {
        const res = await fetch("/api/geo/detect");
        const data = await res.json();
        if (!data.is_brazil) {
          router.replace("/of");
          return;
        }
      } catch {
        // Silently fail if geo detection doesn't work
      }
    }

    async function checkAuth() {
      const { data: userData } = await supabaseBrowser.auth.getUser();
      if (userData.user) {
        router.replace("/content/emilly");
        return;
      }
      setMounted(true);
    }

    checkLocation();
    checkAuth();
  }, [router]);

  if (!mounted) return null;

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
            onSubscribe={() => openModal("1 Mês", 7.87)}
            onLogin={() => openModal("1 Mês", 7.87)}
          />

          <PlansSection onSelect={(label, amount) => openModal(label, amount)} />

          <ContentFeed onLockedClick={() => openModal("1 Mês", 7.87)} />
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
