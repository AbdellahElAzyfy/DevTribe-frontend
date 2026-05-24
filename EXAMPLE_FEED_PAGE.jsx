/**
 * EXAMPLE: Posts Feed Component
 *
 * This shows a complete, production-ready implementation of:
 * - Fetching posts with pagination
 * - Loading/error states
 * - Voting with optimistic updates
 * - Proper cache management
 *
 * Located: features/posts/pages/FeedPage.jsx
 */

import { useState } from "react";
import {
  useFeed,
  useVotePost,
  useDeletePost,
} from "../../../hooks/usePostQueries";
import { useCurrentUser } from "../../../hooks/useAuthQueries";
import { getErrorMessage } from "../../../utils/errorHandler";

export function FeedPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch personalized feed for authenticated user
  const {
    data: feedData,
    isLoading: isFeedLoading,
    error: feedError,
    isPending,
  } = useFeed(
    { page, limit, sortBy: "trending" },
    { keepPreviousData: true }, // Avoid UI flash when changing pages
  );

  // Get current user info for ownership checks
  const { data: currentUser } = useCurrentUser();

  // Vote mutation with optimistic updates
  const { mutate: vote, isPending: isVoting } = useVotePost({
    onError: (error) => {
      console.error("Vote failed:", error);
      // Error handling and rollback is automatic via React Query
    },
  });

  // Delete mutation
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost({
    onSuccess: () => {
      alert("Post deleted successfully");
    },
    onError: (error) => {
      alert(`Failed to delete post: ${getErrorMessage(error)}`);
    },
  });

  // Handle upvote/downvote click
  const handleVote = (postId, currentVote, newValue) => {
    // If clicking the same vote, toggle it off
    const finalValue = currentVote === newValue ? null : newValue;
    vote({ postId, value: finalValue });
  };

  // Handle delete click
  const handleDelete = (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  // Loading state
  if (isFeedLoading && !feedData) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (feedError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Failed to load feed</h3>
        <p className="text-red-700 text-sm">{getErrorMessage(feedError)}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const posts = feedData?.posts || [];
  const pagination = feedData?.pagination;

  // Empty state
  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts in your feed yet</p>
        <p className="text-gray-400 text-sm">
          Join communities or follow users to see posts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isAuthor = currentUser?.id === post.author.id;
          const userVote = post.votes?.userVote;

          return (
            <article
              key={post.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <span>by {post.author.username}</span>
                    {post.community && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          r/{post.community.name}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Stats and Actions */}
              <div className="flex items-center justify-between text-gray-600">
                {/* Votes */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(post.id, userVote, "up")}
                    disabled={isVoting}
                    className={`flex items-center gap-1 px-3 py-2 rounded transition ${
                      userVote === "up"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-gray-100 text-gray-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>👍</span>
                    <span>{post.votes?.upvotes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(post.id, userVote, "down")}
                    disabled={isVoting}
                    className={`flex items-center gap-1 px-3 py-2 rounded transition ${
                      userVote === "down"
                        ? "bg-red-100 text-red-700"
                        : "hover:bg-gray-100 text-gray-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>👎</span>
                    <span>{post.votes?.downvotes || 0}</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <span>💬</span>
                  <span>{post.commentsCount || 0} comments</span>
                </div>

                {/* Share */}
                <button className="px-3 py-2 hover:bg-gray-100 rounded text-gray-600">
                  Share
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > limit && (
        <div className="flex justify-center gap-2 py-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || isPending}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(pagination.total / limit)}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(pagination.total / limit) || isPending}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loader component
 */
function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-32 bg-gray-200 rounded mb-4"></div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded w-12"></div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
}
