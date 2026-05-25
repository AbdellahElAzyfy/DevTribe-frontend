import { useState } from "react";
import {
  useToggleSavedPostMutation,
  useVotePostMutation,
} from "./usePostQueries";
import PostCardHeader from "./components/PostCardHeader";
import PostCardBody from "./components/PostCardBody";
import PostCardActions from "./components/PostCardActions";
import PostCardComments from "./components/PostCardComments";
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

  const toggleSavedPostMutation = useToggleSavedPostMutation();
  const votePostMutation = useVotePostMutation();
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
          <PostCardHeader
            user={user}
            communityName={communityName ?? community?.name}
            communitySlug={community?.slug}
            createdAt={createdAt}
            readTime={readTime}
            isEdited={isEdited}
            content={content}
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
            commentsCount={commentsCount ?? commentCount ?? comments.length}
            onToggleComments={handleToggleComments}
            isSaved={isSaved}
            isTogglingSavedState={isTogglingSavedState}
            onToggleSaved={() => toggleSavedPostMutation.mutate(post.id)}
          />

          {isCommentsOpen ? (
            <PostCardComments
              postId={post.id}
              initialVisibleCount={INITIAL_VISIBLE_COMMENTS}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
