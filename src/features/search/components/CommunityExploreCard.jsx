import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import {
  useJoinCommunity,
  useLeaveCommunity,
} from "../../../hooks/useCommunityQueries";

const ACCENTS = [
  "from-blue-600/80 to-indigo-700/80",
  "from-purple-600/80 to-violet-700/80",
  "from-emerald-600/80 to-teal-700/80",
  "from-rose-600/80 to-pink-700/80",
  "from-amber-600/80 to-orange-700/80",
  "from-cyan-600/80 to-sky-700/80",
];

const getAccent = (slug = "") => {
  const hash = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ACCENTS[hash % ACCENTS.length];
};

function formatMembers(count) {
  const safe = Number(count) || 0;
  if (safe >= 1000) return `${(safe / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return safe.toString();
}

function CommunityExploreCard({ community }) {
  const accent = getAccent(community.slug);
  const memberLabel = formatMembers(community.memberCount);

  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();
  const isPending = joinMutation.isPending || leaveMutation.isPending;

  const handleToggleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (community.isJoined) {
      leaveMutation.mutate(community.slug);
    } else {
      joinMutation.mutate(community.slug);
    }
  };

  return (
    <Link
      to={`/community/${community.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/60 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/80"
    >
      <div
        className={`bg-gradient-to-br ${accent} px-4 py-3.5 ring-1 ring-white/10`}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">
          r/{community.slug}
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-white sm:text-base">
          {community.name}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <p className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-slate-400">
          {community.description || "A growing community of developers."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <FaUsers className="h-3 w-3 text-slate-500" />
            {memberLabel} {Number(community.memberCount) === 1 ? "member" : "members"}
          </span>

          <button
            type="button"
            onClick={handleToggleJoin}
            disabled={isPending}
            className={`rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 ${
              community.isJoined
                ? "border-slate-700 bg-slate-800/80 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
                : "border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
            }`}
          >
            {isPending ? "..." : community.isJoined ? "Joined" : "Join"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CommunityExploreCard;
