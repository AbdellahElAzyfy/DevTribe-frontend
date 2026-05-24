import { useState, useMemo } from "react";
import { FaBookmark } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import SavedPostCardList from "./SavedPostCardList";
import { useSavedPostsQuery } from "./useSavedPostsQuery";
import EmptyStateCard from "../../ui/EmptyStateCard";
import PageShell from "../../ui/PageShell";

export default function SavedPostsPage() {
  const { data: savedPosts = [], isLoading, isError } = useSavedPostsQuery();
  const [removedPostIds, setRemovedPostIds] = useState(new Set());

  // Filter out removed posts
  const displayedPosts = useMemo(
    () => savedPosts.filter((post) => !removedPostIds.has(post.id)),
    [savedPosts, removedPostIds],
  );

  const handleRemovePost = (postId) => {
    setRemovedPostIds((prev) => new Set([...prev, postId]));
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-6xl" padding="pb-4">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse space-y-3">
          <div className="h-10 w-40 rounded-lg bg-slate-800/60" />
          <div className="h-4 w-96 rounded-lg bg-slate-800/40" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-96 rounded-xl bg-slate-800/40" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell maxWidth="max-w-6xl" padding="pb-4">
        <EmptyStateCard
          title="Failed to load saved posts"
          description="Something went wrong. Please try refreshing the page."
          icon={<FaBookmark className="h-6 w-6 text-red-400" />}
          className="border-red-500/30 bg-linear-to-br from-red-950/20 to-slate-950/40 p-8"
          titleClassName="text-red-300"
          iconWrapperClassName="mb-3"
          iconContainerClassName="rounded-full bg-red-500/20 p-3"
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-6xl" padding="pb-4">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-2.5">
            <FaBookmark className="h-5 w-5 text-slate-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Saved Posts
          </h1>
        </div>
        <p className="text-sm text-slate-400 sm:text-base">
          Your personal curated collection of posts. Bookmark posts you want to
          remember.
        </p>
      </div>

      {displayedPosts.length > 0 ? (
        <>
          {/* Posts Count */}
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-300">
              {displayedPosts.length} post
              {displayedPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid Layout */}
          <SavedPostCardList
            posts={displayedPosts}
            onRemove={handleRemovePost}
          />
        </>
      ) : (
        <EmptyStateCard
          title="No saved posts yet"
          description="Start saving posts from the feed to build your personal collection."
          meta="Posts you save will appear here in a beautiful grid layout."
          icon={<FaBookmark className="h-6 w-6 text-sky-300" />}
          className="bg-linear-to-br from-slate-900/40 to-slate-950/60 p-8 sm:p-12"
          iconContainerClassName="rounded-full border border-sky-500/15 bg-slate-800/60 p-3"
        />
      )}
    </PageShell>
  );
}
