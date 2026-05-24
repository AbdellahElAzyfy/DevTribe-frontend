import { useEffect, useState } from "react";
import { HiMagnifyingGlass, HiSparkles } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useExploreDataQuery } from "./useExploreDataQuery";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import TopicChip from "./components/TopicChip";
import CommunityExploreCard from "./components/CommunityExploreCard";
import TrendingPostCard from "./components/TrendingPostCard";
import DiscoverPostCard from "./components/DiscoverPostCard";
import PageShell from "../../ui/PageShell";

const SEARCH_DEBOUNCE_MS = 250;

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicFilterFromUrl = (searchParams.get("topic") || "").trim();
  const [topicInput, setTopicInput] = useState(topicFilterFromUrl);
  const debouncedTopicFilter = useDebouncedValue(
    topicInput.trim(),
    SEARCH_DEBOUNCE_MS,
  );
  const { data, isLoading, isError, isFetching } =
    useExploreDataQuery(debouncedTopicFilter);

  useEffect(() => {
    setTopicInput(topicFilterFromUrl);
  }, [topicFilterFromUrl]);

  useEffect(() => {
    if (!debouncedTopicFilter) {
      setSearchParams({}, { replace: true });
      return;
    }

    if (debouncedTopicFilter !== topicFilterFromUrl) {
      setSearchParams({ topic: debouncedTopicFilter }, { replace: true });
    }
  }, [debouncedTopicFilter, setSearchParams, topicFilterFromUrl]);

  const handleTopicFilterChange = (event) => {
    setTopicInput(event.target.value);
  };

  if (isLoading && !data) {
    return (
      <AsyncStateNotice
        message="Loading explore data..."
        maxWidth="max-w-5xl"
      />
    );
  }

  if (isError || !data) {
    return (
      <AsyncStateNotice
        message="Failed to load explore data."
        tone="error"
        maxWidth="max-w-5xl"
      />
    );
  }

  const topics = data.topics ?? [];
  const communities = data.communities ?? [];
  const posts = data.posts ?? [];
  const trendingPosts = posts.slice(0, 2);
  const discoverPosts = posts.slice(2);

  return (
    <PageShell
      maxWidth="max-w-6xl"
      spacing="space-y-5 sm:space-y-6"
      padding="pb-5 sm:pb-6"
    >
      <section className="rounded-2xl border border-slate-700/70 bg-slate-900/55 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Explore
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Discover posts, topics, and communities built by developers.
            </p>
          </div>
          <span className="hidden rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200 sm:inline-flex sm:items-center sm:gap-1.5">
            <HiSparkles className="h-3.5 w-3.5" />
            Discovery hub
          </span>
        </div>

        <div className="relative mt-4 sm:mt-5">
          <HiMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <input
            id="explore-topic-filter"
            type="text"
            value={topicInput}
            onChange={handleTopicFilterChange}
            placeholder="Search posts, topics, or communities..."
            className="h-12 w-full rounded-2xl border border-slate-700/70 bg-slate-900/70 pl-11 pr-4 text-[15px] text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-blue-400/60 sm:h-13 sm:text-base"
          />
        </div>

        <div className="mt-4 -mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 pb-1">
            {topics.length ? (
              topics.map((topic) => {
                const isActive =
                  topic.toLowerCase() === debouncedTopicFilter.toLowerCase();

                return (
                  <TopicChip
                    key={topic}
                    topic={topic}
                    isActive={isActive}
                    onClick={() => setTopicInput(isActive ? "" : topic)}
                  />
                );
              })
            ) : (
              <p className="px-2 text-sm text-slate-400">
                No topics found for "{debouncedTopicFilter}".
              </p>
            )}
          </div>
        </div>

        {isFetching ? (
          <p className="mt-2 text-xs text-slate-500">Updating results...</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-800/70 bg-slate-900/35 p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Trending posts
          </h2>
          <span className="text-xs text-slate-500">Updated in real time</span>
        </div>

        {trendingPosts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {trendingPosts.map((post) => (
              <TrendingPostCard key={`trending-${post.id}`} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/55 p-5 text-sm text-slate-400">
            No trending posts available.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800/70 bg-slate-900/35 p-3.5 sm:p-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Discover posts
        </h2>
        <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(discoverPosts.length ? discoverPosts : posts).map((post) => (
            <DiscoverPostCard key={`discover-${post.id}`} post={post} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800/70 bg-slate-900/35 p-3.5 sm:p-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Suggested communities
        </h2>
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityExploreCard key={community.id} community={community} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
