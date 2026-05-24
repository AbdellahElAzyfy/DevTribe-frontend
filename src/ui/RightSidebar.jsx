import {
  HiOutlineInformationCircle,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useCommunitiesQuery } from "../features/communities/useCommunityQueries";
import { useExploreDataQuery } from "../features/search/useExploreDataQuery";
import { formatCompactCount } from "../utils/formatters";

function RightSidebar() {
  const {
    data: exploreData,
    isLoading: isExploreLoading,
    isError: isExploreError,
  } = useExploreDataQuery();
  const {
    data: communitiesData,
    isLoading: isCommunitiesLoading,
    isError: isCommunitiesError,
  } = useCommunitiesQuery();

  console.log(exploreData);
  const topics = [].slice(0, 5);
  const communities = (communitiesData ?? []).slice(0, 4);

  return (
    <aside className="dash-rail dash-rail-left relative isolate hidden h-full min-h-0 w-56 self-stretch overflow-hidden [--dash-color:rgba(100,116,139,0.42)] bg-[#0b1120] text-slate-300 lg:block xl:w-72">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-52deg, rgba(100, 116, 139, 0.52) 0px, rgba(100, 116, 139, 0.52) 1px, transparent 1px, transparent 8px)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-6">
        {/* TRENDING POSTS */}
        <div className="dash-frame rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.4)] bg-slate-900/30 p-3">
          <header className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <HiOutlineTrendingUp className="h-4 w-4 text-blue-400" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Trending Now
            </h2>
          </header>

          <div className="flex flex-col gap-2 pt-3">
            {isExploreLoading ? (
              <p className="px-2 py-2 text-xs text-slate-400">
                Loading topics...
              </p>
            ) : null}

            {isExploreError ? (
              <p className="px-2 py-2 text-xs text-red-300">
                Could not load topics.
              </p>
            ) : null}

            {!isExploreLoading && !isExploreError && !topics.length ? (
              <p className="px-2 py-2 text-xs text-slate-400">
                No trending topics yet.
              </p>
            ) : null}

            {!isExploreLoading && !isExploreError
              ? topics.map((topic, index) => (
                  <Link
                    key={topic}
                    to={`/explore?topic=${encodeURIComponent(topic)}`}
                    className="rounded-lg border border-transparent px-2 py-2 text-xs text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/50 hover:text-slate-100"
                  >
                    <div className="font-medium">#{topic}</div>
                    <div className="text-[10px] text-slate-400">
                      Trending topic {index + 1}
                    </div>
                  </Link>
                ))
              : null}
          </div>
        </div>

        {/* SUGGESTED COMMUNITIES */}
        <div className="dash-frame rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.4)] bg-slate-900/30 p-3">
          <header className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <HiOutlineUserGroup className="h-4 w-4 text-blue-400" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Communities
            </h2>
          </header>

          <div className="flex flex-col gap-2 pt-3">
            {isCommunitiesLoading ? (
              <p className="px-2 py-2 text-xs text-slate-400">
                Loading communities...
              </p>
            ) : null}

            {isCommunitiesError ? (
              <p className="px-2 py-2 text-xs text-red-300">
                Could not load communities.
              </p>
            ) : null}

            {!isCommunitiesLoading &&
            !isCommunitiesError &&
            !communities.length ? (
              <p className="px-2 py-2 text-xs text-slate-400">
                No communities yet.
              </p>
            ) : null}

            {!isCommunitiesLoading && !isCommunitiesError
              ? communities.map((community) => (
                  <Link
                    key={community.id}
                    to={`/community/${community.slug}`}
                    className="rounded-lg border border-transparent px-2 py-2 text-xs text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/50 hover:text-slate-100"
                  >
                    <div className="font-medium">#{community.slug}</div>
                    <span className="text-[10px] text-slate-400">
                      {formatCompactCount(community.memberCount || 0)} members
                    </span>
                  </Link>
                ))
              : null}
          </div>
        </div>

        {/* ABOUT */}
        <div className="dash-frame rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.4)] bg-slate-900/30 p-3">
          <header className="flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <HiOutlineInformationCircle className="h-4 w-4 text-blue-400" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              About
            </h2>
          </header>

          <div className="pt-3">
            <p className="text-[10px] leading-relaxed text-slate-400">
              A modern community platform for sharing ideas, discussions, and
              knowledge.
            </p>

            <div className="mt-3 flex gap-2 pt-3 border-t border-slate-700/50">
              <Link
                to="/"
                className="flex-1 rounded-lg border border-transparent px-2 py-1.5 text-center text-[10px] font-medium text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/50 hover:text-slate-100"
              >
                Terms
              </Link>
              <Link
                to="/"
                className="flex-1 rounded-lg border border-transparent px-2 py-1.5 text-center text-[10px] font-medium text-slate-300 transition duration-200 hover:border-slate-700/70 hover:bg-slate-800/50 hover:text-slate-100"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
