import { HiShieldCheck } from "react-icons/hi2";
import { Link } from "react-router-dom";

function SidebarManageSection({ joinedCommunities, onNavigate }) {
  return (
    <div className="px-2 pt-3">
      <h2 className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Administration
      </h2>

      <Link
        to="/manage-communities"
        onClick={onNavigate}
        className="group mb-2 flex w-full items-center gap-2 rounded-lg border border-slate-700/70 bg-blue-600/10 px-3 py-2 text-left text-xs font-medium text-blue-400 transition duration-200 hover:bg-blue-600/20"
      >
        <HiShieldCheck className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
        <span>Moderation Hub</span>
      </Link>

      {joinedCommunities.length ? (
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 px-2 py-2">
          <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Your communities
          </p>
          {joinedCommunities.map((community) => (
            <Link
              key={`joined-${community.id}`}
              to={`/community/${community.slug}`}
              onClick={onNavigate}
              className="block rounded-md border border-transparent px-2 py-1 text-xs font-medium text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/60 hover:text-slate-100"
            >
              r/{community.slug}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SidebarManageSection;
