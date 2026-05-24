import { useState } from "react";
import CommentItem from "../../comments/components/CommentItem";
import CommentInput from "../../comments/components/CommentInput";
import { useListComments } from "../../../hooks/useCommentQueries";

function PostCardComments({ postId, initialVisibleCount = 2 }) {
  const [limit, setLimit] = useState(initialVisibleCount);
  const { data: commentsData, isLoading } = useListComments(postId, { limit });

  const comments = commentsData?.comments || [];
  const totalComments = commentsData?.total || 0;
  const hasMore = totalComments > comments.length;

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
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={`${postId}-${comment.id}`} comment={comment} />
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
              View more comments ({totalComments - comments.length} left)
            </button>
          )}

          {limit > initialVisibleCount && (
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
