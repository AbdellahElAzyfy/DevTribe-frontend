import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToggleSavedPostMutation,
  useVotePostMutation,
} from "./usePostQueries";
import { useDeletePost } from "../../hooks/usePostQueries";
import { useSharePost } from "./useSharePost";
import { useAuth } from "../../hooks/useAuth";
import PostCardHeader from "./components/PostCardHeader";
import PostCardBody from "./components/PostCardBody";
import PostCardActions from "./components/PostCardActions";
import PostCardComments from "./components/PostCardComments";
import ConfirmDialog from "../../ui/ConfirmDialog";
import resolveImageUrl from "../../utils/resolveImageUrl";

const INITIAL_VISIBLE_COMMENTS = 2;

export default function PostCard({ post }) {
  const {
    title,
    content,
    votes,
    voteCount,
    imageUrl,
    image,
    createdAt,
    author: user,
    commentsCount,
    commentCount,
    communityName,
    community,
    readTime,
    isEdited,
    isSaved,
    tags,
  } = post;
  const safeImageUrl = resolveImageUrl(imageUrl || image);
  const normalizedVotes = Number(voteCount ?? votes ?? 0);
  const safeVoteCount = Number.isFinite(normalizedVotes) ? normalizedVotes : 0;
  const userVote = Number(post.userVote ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(
    INITIAL_VISIBLE_COMMENTS,
  );
  // Live comment total reported by the comments list (source of truth once
  // comments have loaded). Falls back to the post's stored count beforehand.
  const [liveCommentTotal, setLiveCommentTotal] = useState(null);

  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toggleSavedPostMutation = useToggleSavedPostMutation();
  const votePostMutation = useVotePostMutation();
  const deletePostMutation = useDeletePost({
    onSuccess: () => setIsDeleteOpen(false),
  });
  const { share, didCopy: didCopyShareLink } = useSharePost({
    postId: post.id,
    title,
  });

  const canManage =
    Boolean(currentUser?.username) && currentUser.username === user?.username;

  const isTogglingSavedState =
    toggleSavedPostMutation.isPending &&
    Number(toggleSavedPostMutation.variables) === post.id;

  const comments = post.comments ?? [];

  const handleToggleComments = () => {
    setIsCommentsOpen((prev) => {
      if (prev) {
        setVisibleCommentsCount(INITIAL_VISIBLE_COMMENTS);
      }
      return !prev;
    });
  };

  const handleVote = (value) => {
    if (votePostMutation.isPending) return;
    votePostMutation.mutate({ postId: post.id, value });
  };

  return (
    <article className="group rounded-xl border border-slate-700/70 bg-slate-900/55 shadow-lg shadow-black/25 ring-1 ring-slate-800/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/70 hover:shadow-black/40">
      <div className="p-4 sm:p-5">
        <div className="min-w-0">
          {post.isApproved === false ? (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
              Pending review
            </div>
          ) : null}
          <PostCardHeader
            user={user}
            communityName={communityName ?? community?.name}
            communitySlug={community?.slug}
            createdAt={createdAt}
            readTime={readTime}
            isEdited={isEdited}
            content={content}
            canManage={canManage}
            onEdit={() => navigate(`/post/${post.id}/edit`)}
            onDelete={() => setIsDeleteOpen(true)}
          />

          <PostCardBody
            title={title}
            content={content}
            imageUrl={safeImageUrl}
            tags={tags}
          />

          <PostCardActions
            fakeVotes={safeVoteCount}
            userVote={userVote}
            onUpvote={() => handleVote(1)}
            onDownvote={() => handleVote(-1)}
            canDownvote={true}
            isVoting={votePostMutation.isPending}
            commentsCount={
              liveCommentTotal ??
              commentsCount ??
              commentCount ??
              comments.length
            }
            onToggleComments={handleToggleComments}
            onShare={share}
            didCopyShareLink={didCopyShareLink}
            isSaved={isSaved}
            isTogglingSavedState={isTogglingSavedState}
            onToggleSaved={() => toggleSavedPostMutation.mutate(post.id)}
          />

          {isCommentsOpen ? (
            <PostCardComments
              postId={post.id}
              initialVisibleCount={INITIAL_VISIBLE_COMMENTS}
              onTotalChange={setLiveCommentTotal}
            />
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete post"
        description="This will permanently delete your post and its comments. This action cannot be undone."
        confirmLabel="Delete post"
        isLoading={deletePostMutation.isPending}
        onConfirm={() => deletePostMutation.mutate(post.id)}
        onClose={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}
