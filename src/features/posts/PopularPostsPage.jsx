import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineFire, HiOutlineSparkles, HiOutlineClock } from "react-icons/hi2";
import PostCardList from "./components/PostCardList";
import PostsSectionHeader from "./components/PostsSectionHeader";
import { usePopularPostsQuery } from "./usePostQueries";
import PageShell from "../../ui/PageShell";
import EmptyStateCard from "../../ui/EmptyStateCard";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import NewPostsBanner from "../../realtime/NewPostsBanner";
import { queryKeys } from "../../lib/queryKeys";

const SORT_TABS = [
  { id: "hot", label: "Hot", icon: HiOutlineFire },
  { id: "top", label: "Top", icon: HiOutlineSparkles },
  { id: "newest", label: "New", icon: HiOutlineClock },
];

const VALID_SORTS = new Set(SORT_TABS.map((t) => t.id));

export default function PopularPostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = (searchParams.get("sort") || "").trim();
  const sortBy = VALID_SORTS.has(sortParam) ? sortParam : "hot";

  const params = useMemo(() => ({ sortBy }), [sortBy]);
  const { data: posts = [], isLoading, isError } = usePopularPostsQuery(params);

  const handleSortChange = (nextSort) => {
    if (nextSort === sortBy) return;
    if (nextSort === "hot") {
      // Default — drop the param to keep URLs clean.
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ sort: nextSort }, { replace: true });
    }
  };

  return (
    <PageShell maxWidth="max-w-4xl">
      <PostsSectionHeader
        title="Popular posts"
        description="The highest-rated content on DevTribe, ranked by the community."
      />

      <div className="mt-5 flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/55 p-1 sm:w-fit">
        {SORT_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === sortBy;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSortChange(id)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 sm:flex-initial sm:px-4 ${
                isActive
                  ? "bg-blue-500/15 text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      <NewPostsBanner listKey={queryKeys.posts.list(params)} />

      {isLoading ? (
        <AsyncStateNotice
          message="Loading the most popular posts..."
          maxWidth=""
        />
      ) : isError ? (
        <AsyncStateNotice
          message="Failed to load popular posts. Please try again later."
          tone="error"
          maxWidth=""
        />
      ) : posts.length ? (
        <PostCardList posts={posts} />
      ) : (
        <EmptyStateCard
          title="No popular posts found"
          description="It looks like there aren't any upvoted posts yet. Be the first to start a trend!"
        />
      )}
    </PageShell>
  );
}
