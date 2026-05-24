/**
 * EXAMPLE: Post Detail with Comments Component
 *
 * This shows a complete implementation of:
 * - Fetching a single post with details
 * - Loading/error states
 * - Comments list with pagination
 * - Creating new comments
 * - Voting on comments with optimistic updates
 * - Proper React Query cache management
 *
 * Located: features/posts/pages/PostDetailPage.jsx
 */

import { useState } from "react";
import { usePost, useVotePost } from "../../../hooks/usePostQueries";
import {
  useListComments,
  useCreateComment,
  useVoteComment,
  useDeleteComment,
  useUpdateComment,
} from "../../../hooks/useCommentQueries";
import { useCurrentUser } from "../../../hooks/useAuthQueries";
import { getErrorMessage } from "../../../utils/errorHandler";

export function PostDetailPage({ postId }) {
  const [commentPage, setCommentPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const commentsLimit = 10;

  // Fetch post details
  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
  } = usePost(postId);

  // Fetch comments
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useListComments(
    postId,
    { page: commentPage, limit: commentsLimit },
    {
      enabled: !!postId,
    },
  );

  // Get current user
  const { data: currentUser } = useCurrentUser();

  // Mutations
  const { mutate: votePost } = useVotePost({
    onError: (error) => {
      console.error("Vote failed:", error);
    },
  });

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment({
      onSuccess: () => {
        // Reset form
        document.getElementById("commentForm")?.reset();
      },
      onError: (error) => {
        alert(`Failed to post comment: ${getErrorMessage(error)}`);
      },
    });

  const { mutate: voteComment } = useVoteComment();

  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment({
      onSuccess: () => {
        alert("Comment deleted");
      },
    });

  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment({
      onSuccess: () => {
        setEditingCommentId(null);
      },
    });

  // Loading state
  if (isPostLoading) {
    return <PostDetailSkeleton />;
  }

  if (postError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{getErrorMessage(postError)}</p>
      </div>
    );
  }

  const post = postData?.post;
  if (!post) return <div>Post not found</div>;

  const isAuthor = currentUser?.id === post.author.id;
  const userPostVote = post.votes?.userVote;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ============ POST DETAIL ============ */}
      <article className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <img
              src={post.author.avatar || "https://via.placeholder.com/32"}
              alt={post.author.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{post.author.username}</span>
            <span>•</span>
            {post.community && (
              <>
                <span className="text-blue-600">r/{post.community.name}</span>
                <span>•</span>
              </>
            )}
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </div>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        {/* Content */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Vote Actions */}
        <div className="flex items-center gap-4 border-t border-b border-gray-200 py-4">
          <button
            onClick={() =>
              votePost({
                postId,
                value: userPostVote === "up" ? null : "up",
              })
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              userPostVote === "up"
                ? "bg-green-100 text-green-700"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            👍 {post.votes?.upvotes || 0} Upvote
          </button>

          <button
            onClick={() =>
              votePost({
                postId,
                value: userPostVote === "down" ? null : "down",
              })
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              userPostVote === "down"
                ? "bg-red-100 text-red-700"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            👎 {post.votes?.downvotes || 0} Downvote
          </button>

          <div className="ml-auto text-sm text-gray-600">
            {post.commentsCount || 0} Comments
          </div>
        </div>
      </article>

      {/* ============ COMMENTS SECTION ============ */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

        {/* Create Comment Form */}
        {currentUser && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <form
              id="commentForm"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const content = formData.get("content");

                if (!content.trim()) {
                  alert("Please write a comment");
                  return;
                }

                createComment({
                  postId,
                  data: { content: content.trim() },
                });
              }}
            >
              <textarea
                name="content"
                placeholder="Write a comment..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={isCreatingComment}
                className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isCreatingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        )}

        {/* Comments List */}
        {isCommentsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : commentsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{getErrorMessage(commentsError)}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commentsData?.comments?.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUser?.id}
                postId={postId}
                onVote={(value) =>
                  voteComment({
                    commentId: comment.id,
                    value: comment.votes?.userVote === value ? null : value,
                  })
                }
                onDelete={() => deleteComment(comment.id)}
                onUpdate={(content) =>
                  updateComment({
                    commentId: comment.id,
                    data: { content },
                  })
                }
                isEditing={editingCommentId === comment.id}
                onEditStart={() => setEditingCommentId(comment.id)}
                onEditEnd={() => setEditingCommentId(null)}
                isUpdating={isUpdatingComment}
                isDeletingComment={isDeletingComment}
              />
            ))}
          </div>
        )}

        {/* Comments Pagination */}
        {commentsData?.pagination &&
          commentsData.pagination.total > commentsLimit && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCommentPage((p) => Math.max(p - 1, 1))}
                disabled={commentPage === 1}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {commentPage} of{" "}
                {Math.ceil(commentsData.pagination.total / commentsLimit)}
              </span>

              <button
                onClick={() => setCommentPage((p) => p + 1)}
                disabled={
                  commentPage >=
                  Math.ceil(commentsData.pagination.total / commentsLimit)
                }
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
      </section>
    </div>
  );
}

/**
 * Individual comment component with voting and editing
 */
function CommentItem({
  comment,
  currentUserId,
  postId,
  onVote,
  onDelete,
  onUpdate,
  isEditing,
  onEditStart,
  onEditEnd,
  isUpdating,
  isDeletingComment,
}) {
  const isAuthor = currentUserId === comment.author.id;
  const userVote = comment.votes?.userVote;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={comment.author.avatar || "https://via.placeholder.com/24"}
            alt={comment.author.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium text-sm">{comment.author.username}</span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isAuthor && (
          <div className="flex gap-2">
            <button
              onClick={onEditStart}
              className="text-xs text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeletingComment}
              className="text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            onUpdate(formData.get("content"));
          }}
        >
          <textarea
            name="content"
            defaultValue={comment.content}
            rows="3"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onEditEnd}
              className="px-3 py-1 border text-xs rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-700 text-sm">{comment.content}</p>
      )}

      {/* Vote Actions */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onVote("up")}
          className={`text-xs px-2 py-1 rounded transition ${
            userVote === "up"
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          👍 {comment.votes?.upvotes || 0}
        </button>

        <button
          onClick={() => onVote("down")}
          className={`text-xs px-2 py-1 rounded transition ${
            userVote === "down"
              ? "bg-red-100 text-red-700"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          👎 {comment.votes?.downvotes || 0}
        </button>
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-96 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
