"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Search,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Bookmark,
  Lock,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  X,
  Images,
  Play,
  UserCheck,
  Grid3X3,
  Sparkles,
} from "lucide-react";

// ─── Dados da Yasmin — edite aqui ────────────────────────────────────────────

const CREATOR = {
  name: "Yasmin Torrez",
  username: "@yasmintorrez",
  bio: "Only those brave enough to uncover every little secret of your Blonde stay... wanna join? 😜",
  profileImg: "/img/coloca_pra_primeira_202604102110.png",
  coverImg: "/img/menina_na_pose_da_segunda_1 (1).jpeg",
};

const STATS = [
  { icon: Images,    value: "159" },
  { icon: Play,      value: "626" },
  { icon: UserCheck, value: "53" },
  { icon: Heart,     value: "364.6K" },
];

const PLANS = [
  { id: "monthly",   label: "1 Month",            price: "R$ 4,87", amount: 4.87, planLabel: "1 Month (26% off)",    stripeUrl: "https://buy.stripe.com/14AdR91bg8632NXakgeIw09" },
  { id: "quarterly", label: "3 Months (42% off)", price: "R$ 9,87", amount: 9.87, planLabel: "3 Months (42% off)",   stripeUrl: "https://buy.stripe.com/dRmeVd1bggCzbkt1NKeIw0a" },
  { id: "lifetime",  label: "Lifetime (50% off)", price: "R$ 35,90", amount: 35.98, planLabel: "Lifetime (50% off)",   stripeUrl: "https://buy.stripe.com/8x200jf264TRfAJ3VSeIw0b" },
];

const FEED_ITEMS = [
  { id: "1", isFree: false, likes: 124, comments: 18, image: "/img/Untitled design (1) (1).png" },
  { id: "2", isFree: false, likes: 341, comments: 47, image: "/img/Untitled design (3).png" },
];

// ─────────────────────────────────────────────────────────────────────────────

const OF_BLUE = "#00AFF0";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(data)}`;
}

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
      <div className="flex items-center gap-1.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-white text-[13px] font-extrabold tracking-tight"
          style={{ background: OF_BLUE }}
        >
          OF
        </div>
        <span className="hidden text-[15px] font-bold text-gray-900 sm:block">OnlyFans</span>
      </div>
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

function OFProfileCard() {
  return (
    <div className="bg-white">
      {/* Cover */}
      <div className="relative h-32 w-full bg-gradient-to-br from-gray-200 to-gray-300 sm:h-40">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `url('${CREATOR.coverImg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Avatar row */}
      <div className="relative px-4 pb-4">
        <div className="absolute -top-10 left-4 h-[76px] w-[76px] overflow-hidden rounded-full border-[3px] border-white bg-gray-200 shadow-sm">
          <img src={CREATOR.profileImg} alt="avatar" className="h-full w-full object-cover" />
        </div>

        {/* Subscribe button top-right */}
        <div className="flex justify-end pt-2">
          <a
            href={PLANS[0].stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2 text-[14px] font-bold text-white transition hover:opacity-90"
            style={{ background: OF_BLUE }}
          >
            Subscribe
          </a>
        </div>

        {/* Name */}
        <div className="mt-2 flex items-center gap-1.5">
          <h1 className="text-[18px] font-bold text-gray-900">{CREATOR.name}</h1>
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

function OFSubscribeBox() {
  const { d, h, m, s } = useCountdown(1 * 24 * 3600 + 4 * 3600 + 59 * 60 + 10);
  const monthlyUrl = PLANS[0].stripeUrl;

  return (
    <div className="border-b border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-4 w-4" style={{ color: OF_BLUE }} />
        <p className="text-[16px] font-bold text-gray-900">Limited Time Offer</p>
      </div>
      <p className="text-[12px] text-gray-500">
        Ends in {d}d {h}h {m}m {String(s).padStart(2, "0")}s
      </p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
        <p className="text-[14px] text-gray-700">
          Exclusive access with daily updates, private chats and intimate conversations.
        </p>
      </div>

      <div className="relative">
        <span className="absolute -top-2.5 left-3 z-10 rounded-full bg-green-400 px-2.5 py-0.5 text-[12px] font-bold text-white">
          Save 26%
        </span>
        <a
          href={monthlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full py-3.5 text-center text-[15px] font-bold text-white transition hover:opacity-90"
          style={{ background: OF_BLUE }}
        >
          Subscribe now — R$ 4,87/month
        </a>
      </div>

      <a
        href={monthlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-full border border-gray-300 bg-white py-3 text-center text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        ★ Call Yasmin now?
      </a>

      <p className="text-right text-[11px] text-gray-400">
        Original price <span className="line-through">R$ 18,74</span>
      </p>
    </div>
  );
}

// ─── Plans Section ────────────────────────────────────────────────────────────

function OFPlansSection() {
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
            <a
              key={plan.id}
              href={plan.stripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-full px-5 py-3.5 text-left font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #00AFF0)" }}
            >
              <span className="text-[15px] font-semibold">{plan.label}</span>
              <span className="text-[15px] font-bold">{plan.price}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Content Feed ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "posts", label: "513 Posts",   Icon: Grid3X3 },
  { id: "media", label: "1,323 Media", Icon: Images },
];

function OFContentFeed({ onLockedClick }: { onLockedClick: () => void }) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="bg-white">
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
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-200">
            <img src={CREATOR.profileImg} alt="avatar" className="h-full w-full object-cover" />
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

// ─── PIX Modal ────────────────────────────────────────────────────────────────

const FEATURES = [
  "Immediate access to exclusive content",
  "Private chat and personalized requests",
  "VIP access unlocked automatically after payment",
];

type Status = "idle" | "creating" | "waiting" | "completed" | "failed" | "expired";

function OFPixModal({
  isOpen,
  onClose,
  planLabel,
  planAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  planLabel: string;
  planAmount: number;
}) {
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
          amount: planAmount,
          description: `Subscription ${planLabel} — Yasmin Torrez`,
        }),
      });

      const data = await res.json();

      if (!res.ok || abortRef.current) {
        if (!abortRef.current) {
          setStatus("failed");
          setErrorMsg(data.error ?? "Failed to generate PIX payment.");
        }
        return;
      }

      setPixCode(data.pix_code);
      setIdentifier(data.identifier);
      setStatus("waiting");
    } catch {
      if (!abortRef.current) {
        setStatus("failed");
        setErrorMsg("Connection error. Please try again.");
      }
    }
  }, [planAmount, planLabel]);

  useEffect(() => {
    if (isOpen && status === "idle") createCharge();
  }, [isOpen, status, createCharge]);

  useEffect(() => {
    if (status !== "waiting" || !identifier) return;

    const poll = async () => {
      if (abortRef.current) return;
      try {
        const res = await fetch(`/api/payment/status/${identifier}`);
        const data = await res.json();
        if (abortRef.current) return;
        if (data.status === "completed") setStatus("completed");
        else if (data.status === "failed") { setStatus("failed"); setErrorMsg("Payment declined."); }
        else if (data.status === "expired") setStatus("expired");
      } catch { /* ignore */ }
    };

    poll();
    const id = setInterval(poll, 5_000);
    return () => clearInterval(id);
  }, [status, identifier]);

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-t-[24px] border border-gray-200 bg-white text-gray-900 sm:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">PAYMENT</p>
            <h2 className="text-[18px] font-bold text-gray-900">PIX Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto px-5 pb-6 pt-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <div className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-2 border-gray-200">
                <img src={CREATOR.profileImg} alt="avatar" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-bold text-gray-900">{CREATOR.name}</p>
                <p className="text-[13px] text-gray-500">{CREATOR.username}</p>
                <div className="mt-2.5 rounded-xl bg-white border border-gray-100 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">AMOUNT</p>
                  <p className="mt-0.5 text-[24px] font-bold text-gray-900 leading-none">
                    {formatBRL(planAmount)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{planLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-[14px] font-bold text-gray-900">What's included</h3>
            <ul className="mt-3 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                  <Check className="h-4 w-4 shrink-0 text-green-500" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-200" />
            <h3 className="text-[14px] font-bold text-gray-900">Payment method</h3>

            {status === "creating" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-9 w-9 animate-spin" style={{ color: OF_BLUE }} />
                <p className="mt-4 text-sm text-gray-500">Generating PIX payment...</p>
              </div>
            )}

            {(status === "failed" || status === "expired") && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <p className="text-sm text-gray-500">
                  {status === "expired" ? "PIX expired." : (errorMsg ?? "Failed to generate PIX.")}
                </p>
                <button
                  onClick={createCharge}
                  className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" /> Try again
                </button>
              </div>
            )}

            {status === "completed" && (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: `${OF_BLUE}18` }}
                >
                  <Check className="h-7 w-7" style={{ color: OF_BLUE }} strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-[17px] font-bold text-gray-900">Payment confirmed!</p>
                <p className="mt-1 text-sm text-gray-500">VIP access unlocked 🎉</p>
              </div>
            )}

            {status === "waiting" && pixCode && (
              <div className="mt-4 text-center">
                <p className="text-[12px] font-semibold" style={{ color: OF_BLUE }}>PIX generated successfully</p>
                <h4 className="mt-2 text-[16px] font-bold text-gray-900">Scan the QR Code</h4>

                <div className="mt-4 flex justify-center">
                  <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-[14px] bg-white p-2 border border-gray-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl(pixCode)} alt="QR Code PIX" className="h-full w-full object-contain" />
                  </div>
                </div>

                <p className="mt-4 text-[14px] font-semibold text-gray-800">Or copy the PIX code</p>
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-left">
                  <p className="line-clamp-2 break-all text-[12px] text-gray-500">{pixCode}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-full text-[14px] font-bold text-white transition hover:opacity-90"
                  style={{ background: OF_BLUE }}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Code copied!" : "Copy PIX code"}
                </button>

                <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-3.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: OF_BLUE }}
                    >
                      i
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-600">
                        Open your banking app, scan the QR Code or paste the PIX code to complete the payment.
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Waiting for payment confirmation...
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

interface SelectedPlan {
  label: string;
  amount: number;
}

export default function YasminOFPage() {
  const [plan, setPlan] = useState<SelectedPlan | null>(null);

  const openModal = (label: string, amount: number) => setPlan({ label, amount });
  const closeModal = () => setPlan(null);

  return (
    <>
      <OFHeader />

      <main className="min-h-screen bg-gray-100 pt-[52px]">
        <div className="mx-auto max-w-[480px] divide-y divide-gray-200 overflow-hidden bg-white shadow-sm">
          <OFProfileCard />
          <OFSubscribeBox />
          <OFPlansSection />
          <OFContentFeed onLockedClick={() => openModal(PLANS[0].planLabel, PLANS[0].amount)} />
        </div>
      </main>

      <OFPixModal
        isOpen={plan !== null}
        onClose={closeModal}
        planLabel={plan?.label ?? ""}
        planAmount={plan?.amount ?? 0}
      />
    </>
  );
}
