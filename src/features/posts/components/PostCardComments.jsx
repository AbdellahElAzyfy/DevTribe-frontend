import { useEffect, useMemo, useState } from "react";
import CommentItem from "../../comments/components/CommentItem";
import CommentInput from "../../comments/components/CommentInput";
import buildCommentTree from "../../comments/buildCommentTree";
import { useListComments } from "../../../hooks/useCommentQueries";

function PostCardComments({ postId, initialVisibleCount = 2, onTotalChange }) {
  // `limit` is the requested page size. When it equals initialVisibleCount the
  // list is collapsed; clicking "View more" grows it, "Show less" resets it.
  const [limit, setLimit] = useState(initialVisibleCount);
  const { data: commentsData, isLoading } = useListComments(postId, { limit });

  const comments = useMemo(
    () => commentsData?.comments || [],
    [commentsData],
  );
  const totalComments = commentsData?.total || 0;
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  // Decide the controls against the authoritative total so deletions collapse
  // them correctly — no effect-driven `limit` resets needed:
  //   hasMore   → more comments exist on the server than are shown right now.
  //   isExpanded→ we're past the initial window AND there's still enough total
  //               to make "collapse" meaningful (hidden once everything fits).
  const hasMore = totalComments > comments.length;
  const isExpanded =
    limit > initialVisibleCount && totalComments > initialVisibleCount;

  // Surface the live total up to the card so the comment-count badge always
  // matches the actual comment list (single source of truth).
  useEffect(() => {
    if (commentsData) {
      onTotalChange?.(totalComments);
    }
  }, [commentsData, totalComments, onTotalChange]);

  return (
    <div className="mt-4 space-y-4 border-t border-slate-700/50 pt-4">
      <div className="pb-2">
        <CommentInput postId={postId} />
      </div>

      <div className="space-y-3">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentItem
              key={`${postId}-${comment.id}`}
              comment={comment}
              postId={postId}
            />
          ))
        ) : (
          <p className="rounded-lg border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-sm text-slate-400">
            No comments yet.
          </p>
        )}

        <div className="flex items-center gap-4">
          {hasMore && (
            <button
              type="button"
              onClick={() => setLimit((prev) => prev + 5)}
              className="text-sm font-medium text-sky-300 transition-colors duration-300 hover:text-sky-200"
            >
              View more comments (
              {Math.max(0, totalComments - comments.length)} left)
            </button>
          )}

          {isExpanded && (
            <button
              type="button"
              onClick={() => setLimit(initialVisibleCount)}
              className="text-sm font-medium text-slate-500 transition-colors duration-300 hover:text-slate-300"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCardComments;
