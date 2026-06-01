import { useParams } from "react-router-dom";
import { usePendingPosts } from "../../hooks/useModerationQueries";
import PostCard from "../posts/PostCard";
import ModerationActionBar from "./ModerationActionBar";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import PageShell from "../../ui/PageShell";

export default function CommunityModerationQueuePage() {
  const { identifier } = useParams();
  const { data, isLoading, isError, error } = usePendingPosts(identifier);

  if (isLoading) {
    return (
      <AsyncStateNotice message="Loading queue..." maxWidth="max-w-3xl" />
    );
  }

  if (isError) {
    const status = error?.response?.status ?? error?.statusCode;
    const message =
      status === 403
        ? "You do not have permission to moderate this community."
        : status === 404
        ? "Community not found."
        : "Failed to load the moderation queue.";
    return (
      <AsyncStateNotice message={message} tone="error" maxWidth="max-w-3xl" />
    );
  }

  const posts = data?.posts ?? [];
  const community = data?.community;
  const slug = community?.slug ?? identifier;

  return (
    <PageShell maxWidth="max-w-3xl">
      <PageHeaderBlock
        title={`Moderation queue – r/${slug}`}
        description={
          posts.length
            ? `${posts.length} post${posts.length === 1 ? "" : "s"} awaiting review.`
            : "Posts awaiting your review."
        }
      />

      {posts.length === 0 ? (
        <AsyncStateNotice
          message="No posts waiting for review."
          maxWidth="max-w-3xl"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="space-y-3">
              <PostCard post={post} />
              <ModerationActionBar post={post} />
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
