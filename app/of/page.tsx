"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Bookmark,
  Lock,
  ChevronUp,
  Loader2,
  Images,
  Play,
  UserCheck,
  Grid3X3,
  Sparkles,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CREATOR = {
  name: "Emilly Faria",
  username: "@millyfaria4",
  bio: "Only those brave enough to uncover every little secret of your Blonde stay... wanna join? 😜",
  stats: { posts: 159, photos: 626, followers: 53, likes: "364.6K" },
};

const STATS = [
  { icon: Images,    value: "159" },
  { icon: Play,      value: "626" },
  { icon: UserCheck, value: "53" },
  { icon: Heart,     value: "364.6K" },
];

const PLANS = [
  { id: "monthly",   label: "1 Month",              price: "$4.87",  amount: 4.87,  planLabel: "1 Month (26% off)" },
  { id: "quarterly", label: "3 Months (16% off)",   price: "$9.87",  amount: 9.87,  planLabel: "3 Months (32% off)" },
  { id: "lifetime",  label: "Lifetime (50% off)",   price: "$35.90",  amount: 35.90,  planLabel: "Lifetime (50% off)" },
];

const FEED_ITEMS = [
  { id: "2", isFree: false, likes: 341, comments: 47, image: "/img/Untitled design (3).png" },
  { id: "3", isFree: false, likes: 218, comments: 29, image: "/img/foto_4.jpg" },
];

const OF_BLUE = "#00AFF0";

// ─── Utilities ────────────────────────────────────────────────────────────────

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

// ─── OF Header ────────────────────────────────────────────────────────────────

function OFHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[52px] items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Logo */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-white text-[13px] font-extrabold tracking-tight"
          style={{ background: OF_BLUE }}
        >
          OF
        </div>
        <span className="hidden text-[15px] font-bold text-gray-900 sm:block">OnlyFans</span>
      </div>
      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100">
          <Search className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-200">
          <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>
      </div>
    </header>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

function OFProfileCard({ onSubscribeClick }: { onSubscribeClick: () => void }) {
  return (
    <div className="bg-white">
      {/* Cover */}
      <div className="relative h-32 w-full bg-gradient-to-br from-gray-200 to-gray-300 sm:h-40">
        <div className="cover-bg absolute inset-0 opacity-100" />
      </div>

      {/* Avatar row */}
      <div className="relative px-4 pb-4">
        <div className="absolute -top-10 left-4 h-[76px] w-[76px] overflow-hidden rounded-full border-[3px] border-white bg-gray-200 shadow-sm">
          <img
            src="/img/WhatsApp Image 2026-04-25 at 11.25.40 (1).jpeg"
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Subscribe button top-right */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onSubscribeClick}
            className="rounded-full px-5 py-2 text-[14px] font-bold text-white transition hover:opacity-90"
            style={{ background: OF_BLUE }}
          >
            Subscribe
          </button>
        </div>

        {/* Name */}
        <div className="mt-2 flex items-center gap-1.5">
          <h1 className="text-[18px] font-bold text-gray-900">{CREATOR.name}</h1>
          {/* Blue verified badge */}
          <svg viewBox="0 0 22 22" className="h-5 w-5 shrink-0" fill="none">
            <path
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              stroke={OF_BLUE}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[14px] text-gray-500">{CREATOR.username}</p>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 border-b border-gray-100 pb-3">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.value} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[14px] font-semibold text-gray-900">{s.value}</span>
              </div>
            );
          })}
        </div>

        {/* Bio */}
        <p className="mt-3 text-[14px] leading-relaxed text-gray-700">{CREATOR.bio}</p>

        {/* Social links */}
        <div className="mt-3 flex items-center gap-2">
          <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200">
            <InstagramIcon />
          </a>
          <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200">
            <TikTokIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Subscribe Box ─────────────────────────────────────────────────────────────

function OFSubscribeBox({ onCheckout }: { onCheckout: () => void }) {
  const { d, h, m, s } = useCountdown(1 * 24 * 3600 + 4 * 3600 + 59 * 60 + 10);

  return (
    <div className="border-b border-gray-200 bg-white p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-4 w-4" style={{ color: OF_BLUE }} />
        <p className="text-[16px] font-bold text-gray-900">Limited Time Offer</p>
      </div>
      <p className="text-[12px] text-gray-500">
        Ends in {d}d {h}h {m}m {String(s).padStart(2, "0")}s
      </p>

      {/* Description */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
        <p className="text-[14px] text-gray-700">
          Exclusive access with daily updates, private chats and intimate conversations.
        </p>
      </div>

      {/* CTA */}
      <div className="relative">
        <span className="absolute -top-2.5 left-3 z-10 rounded-full bg-green-400 px-2.5 py-0.5 text-[12px] font-bold text-white">
          Save 26%
        </span>
        <button
          onClick={onCheckout}
          className="block w-full rounded-full py-3.5 text-center text-[15px] font-bold text-white transition hover:opacity-90"
          style={{ background: OF_BLUE }}
        >
          Subscribe now — $4.87/month
        </button>
      </div>

      {/* Secondary */}
      <button
        onClick={onCheckout}
        className="block w-full rounded-full border border-gray-300 bg-white py-3 text-center text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        ★ Call Milly now?
      </button>

      <p className="text-right text-[11px] text-gray-400">
        Original price <span className="line-through">R$ 16.47</span>
      </p>
    </div>
  );
}

// ─── Plans Section ────────────────────────────────────────────────────────────

function OFPlansSection({ onSelectPlan }: { onSelectPlan: (plan: typeof PLANS[0]) => void }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 transition hover:bg-gray-50"
      >
        <p className="text-[16px] font-bold text-gray-900">Subscription Plans</p>
        <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className="flex w-full items-center justify-between rounded-full px-5 py-3.5 text-left font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #00AFF0)" }}
            >
              <span className="text-[15px] font-semibold">{plan.label}</span>
              <span className="text-[15px] font-bold">{plan.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Content Feed ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "posts", label: "513 Posts",  Icon: Grid3X3 },
  { id: "media", label: "1,323 Media", Icon: Images },
];

function OFContentFeed({ onLockedClick }: { onLockedClick: () => void }) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[14px] font-semibold transition border-b-2 ${
                active
                  ? "border-[#00AFF0] text-[#00AFF0]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-100">
        {FEED_ITEMS.map((item) => (
          <OFFeedCard key={item.id} item={item} onLockedClick={onLockedClick} />
        ))}
      </div>
    </div>
  );
}

function OFFeedCard({
  item,
  onLockedClick,
}: {
  item: (typeof FEED_ITEMS)[0];
  onLockedClick: () => void;
}) {
  return (
    <div className="bg-white">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-200">
            <img
              src="/img/WhatsApp Image 2026-04-25 at 11.25.40 (1).jpeg"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-bold text-gray-900">{CREATOR.name}</span>
              <svg viewBox="0 0 22 22" className="h-4 w-4 shrink-0" fill="none">
                <path
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  stroke={OF_BLUE}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[12px] text-gray-400">{CREATOR.username}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Media */}
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-gray-100"
        onClick={!item.isFree ? onLockedClick : undefined}
      >
        <img src={item.image} alt="media" className="absolute inset-0 h-full w-full object-cover" />
        {!item.isFree && (
          <>
            <div className="absolute inset-0 backdrop-blur-md bg-white/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 backdrop-blur-sm">
                <Lock className="h-5 w-5 text-gray-700" />
              </div>
              <span
                className="rounded-full px-3 py-1 text-[12px] font-bold text-white"
                style={{ background: OF_BLUE }}
              >
                Subscribe to unlock
              </span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-red-500">
            <Heart className="h-4.5 w-4.5" />
            <span className="text-[14px]">{item.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-gray-700">
            <MessageCircle className="h-4.5 w-4.5" />
            <span className="text-[14px]">{item.comments}</span>
          </button>
        </div>
        <button className="text-gray-400 transition hover:text-gray-600">
          <Bookmark className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Social Icons ─────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OFPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planAmount: plan.amount,
          planLabel: plan.planLabel,
          creatorName: CREATOR.name,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout. Tente novamente.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OFHeader />

      <main className="min-h-screen bg-gray-100 pt-[52px]">
        <div className="mx-auto max-w-[480px] divide-y divide-gray-200 overflow-hidden bg-white shadow-sm">
          <OFProfileCard onSubscribeClick={() => handleSelectPlan(PLANS[0])} />
          <OFSubscribeBox onCheckout={() => handleSelectPlan(PLANS[0])} />
          <OFPlansSection onSelectPlan={handleSelectPlan} />
          <OFContentFeed onLockedClick={() => handleSelectPlan(PLANS[0])} />
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-white text-sm">Iniciando checkout...</p>
          </div>
        </div>
      )}
    </>
  );
}
