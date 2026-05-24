import { Link } from "react-router-dom";

function CommunityExploreCard({ community }) {
  return (
    <Link
      to={`/community/${community.slug}`}
      className="group rounded-2xl border border-slate-700/70 bg-slate-900/60 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/80 sm:p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        r/{community.slug}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-100 transition-colors duration-300 group-hover:text-white">
        {community.name}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {community.description}
      </p>
    </Link>
  );
}

export default CommunityExploreCard;
