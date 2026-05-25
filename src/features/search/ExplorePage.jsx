import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  HiMagnifyingGlass,
  HiSparkles,
  HiOutlineFire,
  HiOutlineUserGroup,
  HiOutlineClock,
} from "react-icons/hi2";
import { useListPosts } from "../../hooks/usePostQueries";
import { useListCommunities } from "../../hooks/useCommunityQueries";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import PageShell from "../../ui/PageShell";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import TopicChip from "./components/TopicChip";
import TrendingPostCard from "./components/TrendingPostCard";
import DiscoverPostCard from "./components/DiscoverPostCard";
import CommunityExploreCard from "./components/CommunityExploreCard";

const SEARCH_DEBOUNCE_MS = 250;

const POPULAR_TOPICS = [
  "JavaScript",
  "React",
  "Python",
  "AI",
  "DevOps",
  "Career",
  "Open Source",
  "Web",
  "Backend",
  "Frontend",
];

const TRENDING_LIMIT = 6;
const FRESH_LIMIT = 8;
const COMMUNITIES_LIMIT = 6;

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = (searchParams.get("q") || "").trim();
  const [queryInput, setQueryInput] = useState(queryFromUrl);
  const debouncedQuery = useDebouncedValue(
    queryInput.trim(),
    SEARCH_DEBOUNCE_MS,
  );
  const hasActiveSearch = debouncedQuery.length > 0;

  // Keep the input in sync if someone navigates back/forward
  useEffect(() => {
    setQueryInput(queryFromUrl);
  }, [queryFromUrl]);

  // Push debounced query into the URL (?q=...)
  useEffect(() => {
    if (!debouncedQuery) {
      if (queryFromUrl) setSearchParams({}, { replace: true });
      return;
    }
    if (debouncedQuery !== queryFromUrl) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    }
  }, [debouncedQuery, queryFromUrl, setSearchParams]);

  const trendingQuery = useListPosts(
    { sortBy: "top", limit: TRENDING_LIMIT },
    { enabled: !hasActiveSearch },
  );

  const freshQuery = useListPosts(
    { sortBy: "newest", limit: FRESH_LIMIT },
    { enabled: !hasActiveSearch },
  );

  const searchPostsQuery = useListPosts(
    { search: debouncedQuery, limit: 20 },
    { enabled: hasActiveSearch },
  );

  const communitiesQuery = useListCommunities(
    hasActiveSearch ? { search: debouncedQuery } : {},
  );

  const sortedCommunities = useMemo(() => {
    const list = Array.isArray(communitiesQuery.data)
      ? communitiesQuery.data
      : [];
    return [...list].sort(
      (a, b) => (Number(b.memberCount) || 0) - (Number(a.memberCount) || 0),
    );
  }, [communitiesQuery.data]);

  const handleTopicClick = (topic) => {
    const isActive = topic.toLowerCase() === debouncedQuery.toLowerCase();
    setQueryInput(isActive ? "" : topic);
  };

  const clearSearch = () => setQueryInput("");

  return (
    <PageShell
      maxWidth="max-w-6xl"
      spacing="space-y-5 sm:space-y-6"
      padding="pb-10"
    >
      {/* Hero / Search */}
      <section className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Explore DevTribe
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Trending posts, fresh discussions, and communities worth joining.
            </p>
          </div>
          <span className="hidden rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200 sm:inline-flex sm:items-center sm:gap-1.5">
            <HiSparkles className="h-3.5 w-3.5" />
            Discovery
          </span>
        </div>

        <div className="relative mt-4 sm:mt-5">
          <HiMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search posts, topics, or communities..."
            className="h-12 w-full rounded-2xl border border-slate-700/70 bg-slate-900/70 pl-11 pr-12 text-[15px] text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-blue-400/60 sm:h-13 sm:text-base"
          />
          {queryInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 -mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 pb-1">
            <span className="shrink-0 pl-1 pr-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Topics
            </span>
            {POPULAR_TOPICS.map((topic) => {
              const isActive =
                topic.toLowerCase() === debouncedQuery.toLowerCase();
              return (
                <TopicChip
                  key={topic}
                  topic={topic}
                  isActive={isActive}
                  onClick={() => handleTopicClick(topic)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {hasActiveSearch ? (
        <SearchResults
          query={debouncedQuery}
          postsQuery={searchPostsQuery}
          communities={sortedCommunities}
          isLoadingCommunities={communitiesQuery.isLoading}
        />
      ) : (
        <>
          <TrendingSection query={trendingQuery} />
          <CommunitiesSection
            communities={sortedCommunities.slice(0, COMMUNITIES_LIMIT)}
            isLoading={communitiesQuery.isLoading}
            isError={communitiesQuery.isError}
          />
          <FreshSection query={freshQuery} />
        </>
      )}
    </PageShell>
  );
}

function SectionHeader({ icon: Icon, title, hint }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
        {Icon ? <Icon className="h-5 w-5 text-blue-400" /> : null}
        {title}
      </h2>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </div>
  );
}

function SectionWrapper({ children }) {
  return (
    <section className="rounded-2xl border border-slate-800/70 bg-slate-900/35 p-3.5 sm:p-4">
      {children}
    </section>
  );
}

function TrendingSection({ query }) {
  const posts = Array.isArray(query.data) ? query.data : [];

  return (
    <SectionWrapper>
      <SectionHeader
        icon={HiOutlineFire}
        title="Trending today"
        hint="Most upvoted posts"
      />

      {query.isLoading ? (
        <CardGridSkeleton count={4} variant="trending" />
      ) : query.isError ? (
        <AsyncStateNotice
          message="Couldn't load trending posts."
          tone="error"
          maxWidth=""
        />
      ) : posts.length === 0 ? (
        <EmptyState message="No trending posts yet — be the first to share." />
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {posts.map((post, index) => (
            <TrendingPostCard
              key={`trending-${post.id}`}
              post={post}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

function CommunitiesSection({ communities, isLoading, isError }) {
  return (
    <SectionWrapper>
      <SectionHeader
        icon={HiOutlineUserGroup}
        title="Communities to join"
        hint="Sorted by popularity"
      />

      {isLoading ? (
        <CardGridSkeleton count={3} variant="community" />
      ) : isError ? (
        <AsyncStateNotice
          message="Couldn't load communities."
          tone="error"
          maxWidth=""
        />
      ) : communities.length === 0 ? (
        <EmptyState message="No communities found." />
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityExploreCard
              key={community.id}
              community={community}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

function FreshSection({ query }) {
  const posts = Array.isArray(query.data) ? query.data : [];

  return (
    <SectionWrapper>
      <SectionHeader
        icon={HiOutlineClock}
        title="Fresh posts"
        hint="Just published"
      />

      {query.isLoading ? (
        <CardGridSkeleton count={6} variant="discover" />
      ) : query.isError ? (
        <AsyncStateNotice
          message="Couldn't load recent posts."
          tone="error"
          maxWidth=""
        />
      ) : posts.length === 0 ? (
        <EmptyState message="Nothing new yet." />
      ) : (
        <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <DiscoverPostCard key={`fresh-${post.id}`} post={post} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

function SearchResults({ query, postsQuery, communities, isLoadingCommunities }) {
  const posts = Array.isArray(postsQuery.data) ? postsQuery.data : [];
  const matchedCommunities = communities;
  const totalMatches = posts.length + matchedCommunities.length;

  return (
    <>
      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/35 p-3.5 sm:p-4">
        <p className="text-sm text-slate-400">
          {postsQuery.isLoading || isLoadingCommunities
            ? `Searching for `
            : `Results for `}
          <span className="font-semibold text-slate-100">"{query}"</span>
          {!postsQuery.isLoading && !isLoadingCommunities ? (
            <span className="ml-2 text-slate-500">
              ({totalMatches} {totalMatches === 1 ? "match" : "matches"})
            </span>
          ) : null}
        </p>
      </div>

      <SectionWrapper>
        <SectionHeader
          icon={HiOutlineUserGroup}
          title="Matching communities"
        />
        {isLoadingCommunities ? (
          <CardGridSkeleton count={3} variant="community" />
        ) : matchedCommunities.length === 0 ? (
          <EmptyState message={`No communities match "${query}".`} />
        ) : (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matchedCommunities.map((community) => (
              <CommunityExploreCard
                key={community.id}
                community={community}
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader
          icon={HiOutlineFire}
          title="Matching posts"
          hint={postsQuery.isFetching ? "Updating…" : undefined}
        />
        {postsQuery.isLoading ? (
          <CardGridSkeleton count={6} variant="discover" />
        ) : posts.length === 0 ? (
          <EmptyState message={`No posts match "${query}".`} />
        ) : (
          <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <DiscoverPostCard key={`search-${post.id}`} post={post} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700/70 bg-slate-900/40 p-5 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function CardGridSkeleton({ count = 4, variant = "discover" }) {
  const heightClass =
    variant === "trending"
      ? "h-52"
      : variant === "community"
        ? "h-44"
        : "h-32";
  const cols =
    variant === "trending"
      ? "md:grid-cols-2"
      : variant === "community"
        ? "md:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-3 sm:gap-4 ${cols}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${heightClass} animate-pulse rounded-2xl border border-slate-800/60 bg-slate-900/40`}
        />
      ))}
    </div>
  );
}
