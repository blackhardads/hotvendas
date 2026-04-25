"use client";

import { MoreVertical, Images, Play, UserCheck, Heart } from "lucide-react";
import React from "react";
import { useState } from "react";

const DEFAULT_STATS = [
  { icon: Images,    value: "159" },
  { icon: Play,      value: "626" },
  { icon: UserCheck, value: "53" },
  { icon: Heart,     value: "364.6K" },
];

const DEFAULT_BIO = "Não te conto nada, deixo você descobrir 🤭";

interface ProfileCardProps {
  name?: string;
  username?: string;
  bio?: string;
  stats?: { icon: React.ElementType; value: string }[];
  profileImg?: string;
  coverClass?: string;
  coverImg?: string;
}

export default function ProfileCard({
  name = "Vitória Lima",
  username = "@vitorialima5",
  bio = DEFAULT_BIO,
  stats = DEFAULT_STATS,
  profileImg = "img/WhatsApp Image 2026-04-25 at 11.25.40 (1).jpeg",
  coverClass = "cover-bg",
  coverImg,
}: ProfileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const short = bio.slice(0, 120);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Cover */}
      <div className="relative h-50 w-full bg-gradient-to-br from-[#f0f0f0] via-[#e0e0e0] to-[#d0d0d0] sm:h-32">
        <div
          className={`${coverImg ? "" : coverClass} absolute inset-0 opacity-100`}
          style={coverImg ? { backgroundImage: `url('${coverImg}')`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        />
        {/* Avatar */}
        <div className="absolute -bottom-8 left-4 h-24 w-24 overflow-hidden rounded-full border-[3px] border-white bg-gray-200">
          <img src={profileImg} alt="avatar" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-5 pt-10">
        {/* Name row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] font-bold tracking-[-0.03em] text-black">{name}</h1>
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
            <p className="text-[15px] text-gray-500">{username}</p>
          </div>
          <button className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[14px] font-semibold text-black">{s.value}</span>
              </div>
            );
          })}
        </div>

        {/* Bio */}
        <div className="mt-3">
          <p className="text-[15px] leading-relaxed text-black">
            {expanded ? bio : short + (bio.length > 120 ? "…" : "")}
          </p>
          {bio.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-[12px] font-semibold text-[#e89c30] hover:underline"
            >
              {expanded ? "Ver menos" : "Ler mais"}
            </button>
          )}
        </div>

        {/* Social links */}
        <div className="mt-4 flex items-center gap-2">
          <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-black">
            <InstagramIcon />
          </a>
          <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-black">
            <TikTokIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="black">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="black">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}
