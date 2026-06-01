import { Navigate, useNavigate, useParams } from "react-router-dom";
import { usePost } from "../../hooks/usePostQueries";
import PostCard from "../posts/PostCard";
import ModerationActionBar from "./ModerationActionBar";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import PageShell from "../../ui/PageShell";

export default function PostModerationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = usePost(id);

  if (isLoading) {
    return (
      <AsyncStateNotice
        message="Loading post..."
        maxWidth="max-w-3xl"
      />
    );
  }

  if (isError) {
    const status = error?.response?.status ?? error?.statusCode;
    const message =
      status === 403
        ? "You do not have permission to moderate this post."
        : status === 404
        ? "Post not found. It may have already been declined."
        : "Failed to load the post.";
    return (
      <AsyncStateNotice message={message} tone="error" maxWidth="max-w-3xl" />
    );
  }

  const post = data;

  if (!post) {
    return (
      <AsyncStateNotice
        message="Post unavailable."
        tone="error"
        maxWidth="max-w-3xl"
      />
    );
  }

  if (post.isApproved) {
    return <Navigate to={`/post/${post.id}`} replace />;
  }

  const communitySlug = post.community?.slug;

  return (
    <PageShell maxWidth="max-w-3xl">
      <PageHeaderBlock
        title="Review post"
        description={
          communitySlug
            ? `Moderating a pending post in r/${communitySlug}.`
            : "Moderating a pending post."
        }
      />

      <PostCard post={post} />

      <ModerationActionBar
        post={post}
        onApproved={() => {
          if (communitySlug) {
            navigate(`/community/${communitySlug}/moderation`);
          } else {
            navigate("/notifications");
          }
        }}
        onDeclined={() => {
          if (communitySlug) {
            navigate(`/community/${communitySlug}/moderation`);
          } else {
            navigate("/notifications");
          }
        }}
      />
    </PageShell>
  );
}
