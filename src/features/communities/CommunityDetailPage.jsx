import { useParams } from "react-router-dom";
import PostCard from "../posts/PostCard";
import {
  useCommunityQuery,
  useCommunityPostsQuery,
  useJoinCommunity,
  useLeaveCommunity,
} from "./useCommunityQueries";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import SimpleList from "../../ui/SimpleList";
import PageShell from "../../ui/PageShell";
import NewPostsBanner from "../../realtime/NewPostsBanner";
import { queryKeys } from "../../lib/queryKeys";

export default function CommunityDetailPage() {
  const { id: slug } = useParams();
  
  // Use the specific community query which now includes isJoined status
  const {
    data: community,
    isLoading: communityLoading,
    isError: communityError,
  } = useCommunityQuery(slug);

  // Posts are gated separately: viewing a private community you haven't joined
  // returns the community itself, but its posts are forbidden (403). That must
  // NOT fail the whole page — we still show the community header + join button.
  const {
    data: communityPosts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useCommunityPostsQuery(slug);

  const { mutate: join, isLoading: isJoining } = useJoinCommunity();
  const { mutate: leave, isLoading: isLeaving } = useLeaveCommunity();
  const isPending = isJoining || isLeaving;

  // Only the community query gates the page. The posts query has its own
  // inline loading/error/empty states below.
  if (communityLoading) {
    return (
      <AsyncStateNotice
        message="Loading community details..."
        maxWidth="max-w-4xl"
      />
    );
  }

  if (communityError || !community) {
    return (
      <AsyncStateNotice
        message="Community not found or failed to load."
        tone="error"
        maxWidth="max-w-4xl"
      />
    );
  }

  const isLockedPrivate = community.isPrivate && !community.isJoined;

  const handleToggleJoin = () => {
    if (community.isJoined) {
      leave(community.slug);
    } else {
      join(community.slug);
    }
  };

  return (
    <PageShell maxWidth="max-w-4xl">
      <section className="relative overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/60 p-6 shadow-lg shadow-black/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/90">
              Community
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              r/{community.slug}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
              {community.description || "Welcome to the r/" + community.slug + " community!"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <strong className="text-slate-100">{community.memberCount?.toLocaleString() ?? 0}</strong> members
              </span>
              <span className="flex items-center gap-2">
                <strong className="text-slate-100">{community.postsCount ?? 0}</strong> posts
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleToggleJoin}
              disabled={isPending}
              className={`min-w-[120px] rounded-full border px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 ${
                community.isJoined
                  ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
                  : "border-blue-500 bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95"
              }`}
            >
              {isPending ? "Updating..." : community.isJoined ? "Joined" : "Join Community"}
            </button>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
      </section>

      <NewPostsBanner listKey={queryKeys.posts.list({ community: slug })} />

      {isLockedPrivate || postsError ? (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-8 text-center">
          <p className="text-base font-semibold text-slate-200">
            {isLockedPrivate
              ? "This is a private community"
              : "Posts couldn't be loaded"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {isLockedPrivate
              ? "Join this community to see and create posts."
              : "Something went wrong loading posts. Please try again later."}
          </p>
        </div>
      ) : postsLoading ? (
        <AsyncStateNotice message="Loading posts..." maxWidth="max-w-4xl" />
      ) : (
        <SimpleList
          items={communityPosts}
          className="space-y-4"
          getKey={(post) => post.id}
          renderItem={(post) => <PostCard post={post} />}
        />
      )}
    </PageShell>
  );
}
