import { HiUserGroup } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { Link } from "react-router-dom";

function SidebarCommunitiesSection({
  communityItems,
  isOpen,
  onToggle,
  onNavigate,
}) {
  return (
    <div className="border-b border-slate-700/50 px-2 py-3">
      <h2 className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Communities
      </h2>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/60 hover:text-slate-100"
        >
          <HiUserGroup className="h-4 w-4 shrink-0" />
          <span className="flex-1">All communities</span>
          <HiChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {isOpen ? (
          <div className="space-y-1 pl-4">
            {communityItems.slice(0, 6).map((community) => (
              <Link
                key={community.id}
                to={`/community/${community.slug}`}
                onClick={onNavigate}
                className="block rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/55 hover:text-slate-100"
              >
                #{community.slug}
              </Link>
            ))}

            <Link
              to="/communities"
              onClick={onNavigate}
              className="block rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-sky-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/55 hover:text-sky-200"
            >
              View all communities
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SidebarCommunitiesSection;
