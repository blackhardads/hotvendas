"use client";

import { Images, Play, Heart, MessageCircle, Bookmark, MoreHorizontal, Lock } from "lucide-react";
import { useState } from "react";

const TABS = [
  { id: "posts", label: "513 Postagens", icon: Images },
  { id: "media", label: "1.323 Mídias", icon: Play },
];

const DEFAULT_FEED_ITEMS = [
  { id: "1", isFree: false, likes: 124, comments: 18, image: "/img/WhatsApp Image 2026-04-25 at 11.25.40 (2).jpeg" },
  { id: "2", isFree: false, likes: 341, comments: 47, image: "/img/WhatsApp Image 2026-04-25 at 11.25.41.jpeg" },
];

type FeedItem = { id: string; isFree: boolean; likes: number; comments: number; image: string };

export default function ContentFeed({
  onLockedClick,
  creatorName = "Vitória Lima",
  creatorHandle = "@vitorialima5",
  profileImg = "img/WhatsApp Image 2026-04-25 at 11.25.40 (1).jpeg",
  feedItems = DEFAULT_FEED_ITEMS,
}: {
  onLockedClick: () => void;
  creatorName?: string;
  creatorHandle?: string;
  profileImg?: string;
  feedItems?: FeedItem[];
}) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3.5 text-[15px] font-semibold transition ${
                active ? "text-[#e89c30]" : "text-black-400 hover:text-black-600"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${active ? "text-[#e89c30]" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      {feedItems.map((item) => (
        <FeedCard
          key={item.id}
          item={item}
          onLockedClick={onLockedClick}
          creatorName={creatorName}
          creatorHandle={creatorHandle}
          profileImg={profileImg}
        />
      ))}
    </div>
  );
}

function FeedCard({
  item,
  onLockedClick,
  creatorName,
  creatorHandle,
  profileImg,
}: {
  item: FeedItem;
  onLockedClick: () => void;
  creatorName: string;
  creatorHandle: string;
  profileImg: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-[#e89c30]/40 to-[#f5f5f5] flex items-center justify-center">
            <img src={profileImg} alt="avatar" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-semibold text-black">{creatorName}</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0000]">
                <svg fill="none" viewBox="0 0 22 22" className="h-9 w-9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.00012 12L11.0001 14L15.0001 10M7.83486 4.69705C8.55239 4.63979 9.23358 4.35763 9.78144 3.89075C11.0599 2.80123 12.9403 2.80123 14.2188 3.89075C14.7667 4.35763 15.4478 4.63979 16.1654 4.69705C17.8398 4.83067 19.1695 6.16031 19.3031 7.83474C19.3603 8.55227 19.6425 9.23346 20.1094 9.78132C21.1989 11.0598 21.1989 12.9402 20.1094 14.2187C19.6425 14.7665 19.3603 15.4477 19.3031 16.1653C19.1695 17.8397 17.8398 19.1693 16.1654 19.303C15.4479 19.3602 14.7667 19.6424 14.2188 20.1093C12.9403 21.1988 11.0599 21.1988 9.78144 20.1093C9.23358 19.6424 8.55239 19.3602 7.83486 19.303C6.16043 19.1693 4.83079 17.8397 4.69717 16.1653C4.63991 15.4477 4.35775 14.7665 3.89087 14.2187C2.80135 12.9402 2.80135 11.0598 3.89087 9.78132C4.35775 9.23346 4.63991 8.55227 4.69717 7.83474C4.83079 6.16031 6.16043 4.83067 7.83486 4.69705Z"
                    stroke="orange"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="text-[12px] text-gray-600">{creatorHandle}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Media */}
      <div
        className="relative aspect-video w-full bg-gradient-to-br from-[#f0f0f0] to-[#ffffff] cursor-pointer"
        onClick={!item.isFree ? onLockedClick : undefined}
      >
        {!item.isFree && (
          <>
            <div className="absolute inset-0 z-10 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/0 text-white backdrop-blur-sm border border-white/30 shadow-lg"
                onClick={onLockedClick}
                aria-label="Abrir plano"
              >
                <Lock className="h-5 w-5" />
              </button>
              <span className="rounded-full bg-[#e89c30] px-3 py-1 text-[12px] font-semibold text-black">
                Assinar para ver
              </span>
            </div>
          </>
        )}
        <img src={item.image} alt="media" className={`absolute inset-0 h-full w-full object-cover ${!item.isFree ? 'blur-sm' : ''}`} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-gray-700">
            <Heart className="h-4.5 w-4.5" />
            <span className="text-[15px]">{item.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 transition hover:text-gray-700">
            <MessageCircle className="h-4.5 w-4.5" />
            <span className="text-[15px]">{item.comments}</span>
          </button>
        </div>
        <button className="text-gray-400 transition hover:text-gray-600">
          <Bookmark className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
