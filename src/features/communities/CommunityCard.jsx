import { Link } from "react-router-dom";
import { useJoinCommunity, useLeaveCommunity } from "./useCommunityQueries";
import { useState } from "react";

const DEFAULT_ACCENTS = [
  "from-blue-600 to-indigo-700 shadow-blue-500/20",
  "from-purple-600 to-violet-700 shadow-purple-500/20",
  "from-emerald-600 to-teal-700 shadow-emerald-500/20",
  "from-rose-600 to-pink-700 shadow-rose-500/20",
  "from-amber-600 to-orange-700 shadow-amber-500/20",
];

const getAccent = (slug = "") => {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DEFAULT_ACCENTS[hash % DEFAULT_ACCENTS.length];
};

export default function CommunityCard({ community }) {
  const accentClass = community.accent || getAccent(community.slug);
  const memberCount = (community.memberCount || 0).toLocaleString();
  const postsCount = (community.postsCount || 0).toLocaleString();
  
  const { mutate: join, isLoading: isJoining } = useJoinCommunity();
  const { mutate: leave, isLoading: isLeaving } = useLeaveCommunity();
  const isPending = isJoining || isLeaving;

  const handleToggleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (community.isJoined) {
      leave(community.slug);
    } else {
      join(community.slug);
    }
  };

  return (
    <article className="group rounded-xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/70 hover:shadow-xl hover:shadow-black/40">
      <Link to={`/community/${community.slug}`} className="block">
        <div className={`rounded-lg bg-gradient-to-br ${accentClass} p-4 shadow-inner ring-1 ring-white/10`}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">r/{community.slug}</p>
          <h2 className="mt-1 text-xl font-bold text-white tracking-tight">
            {community.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80 line-clamp-2 min-h-[2.5rem]">
            {community.description || "A growing community of passionate developers."}
          </p>
        </div>
      </Link>

      <div className="mt-5 flex flex-wrap gap-4 text-[12px] font-semibold text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          {memberCount} members
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
          {postsCount} posts
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={handleToggleJoin}
          disabled={isPending}
          className={`rounded-full border px-4 py-1 text-[11px] font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 ${
            community.isJoined 
              ? "border-slate-700 bg-slate-800/80 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400" 
              : "border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
          }`}
        >
          {isPending ? "..." : community.isJoined ? "Joined" : "Join"}
        </button>

        <Link
          to={`/community/${community.slug}`}
          className="rounded-lg border border-slate-700/70 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-100 transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-700 hover:text-white active:scale-95"
        >
          View
        </Link>
      </div>
    </article>
  );
}
