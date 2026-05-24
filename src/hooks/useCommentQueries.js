import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as commentsApi from "../services/apiComments";
import * as votesApi from "../services/apiVotes";
import { queryKeys } from "../lib/queryKeys";

/**
 * Query: List comments for a post with pagination
 * @param {string} postId - Post ID
 * @param {Object} params - Query parameters (page, limit, sortBy)
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useListComments(postId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.comments.listByPost(postId, params),
    queryFn: () => commentsApi.listComments(postId, params),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!postId,
    ...options,
  });
}

/**
 * Mutation: Create comment on post
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useCreateComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }) => commentsApi.createComment(postId, data),
    onSuccess: (data, { postId }, context) => {
      // Invalidate comments list for the post
      // Invalidate ALL comments list variants for this specific post
      queryClient.invalidateQueries({
        queryKey: ["comments", "list", "byPost", String(postId)],
      });

      // Update post's comment count across all views (feeds, community lists, and detail pages)
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      options.onSuccess?.(data, { postId }, context);
    },
    ...options,
  });
}

/**
 * Mutation: Update comment
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdateComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }) =>
      commentsApi.updateComment(commentId, data),
    onSuccess: (data, { commentId }, context) => {
      // Update the specific comment cache
      queryClient.setQueryData(
        queryKeys.comments.detail(commentId),
        data.comment,
      );

      // Invalidate all comments lists (we don't know which post this belongs to)
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.lists(),
      });

      options.onSuccess?.(data, { commentId }, context);
    },
    ...options,
  });
}

/**
 * Mutation: Delete comment
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useDeleteComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentsApi.deleteComment(commentId),
    onSuccess: (data, commentId, context) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      // Invalidate all comments lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.lists(),
      });

      options.onSuccess?.(data, commentId, context);
    },
    ...options,
  });
}

/**
 * Mutation: Vote on comment (with optimistic updates)
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useVoteComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, value }) =>
      votesApi.voteComment(commentId, { value }),
    onMutate: ({ commentId, value }) => {
      // Save previous state for rollback
      const previousComment = queryClient.getQueryData(
        queryKeys.comments.detail(commentId),
      );

      if (previousComment) {
        // Optimistic update
        const updatedComment = {
          ...previousComment,
          votes: {
            ...previousComment.votes,
            userVote: value,
            upvotes:
              value === "up"
                ? previousComment.votes.upvotes + 1
                : value === null && previousComment.votes.userVote === "up"
                  ? previousComment.votes.upvotes - 1
                  : previousComment.votes.upvotes,
            downvotes:
              value === "down"
                ? previousComment.votes.downvotes + 1
                : value === null && previousComment.votes.userVote === "down"
                  ? previousComment.votes.downvotes - 1
                  : previousComment.votes.downvotes,
          },
        };

        queryClient.setQueryData(
          queryKeys.comments.detail(commentId),
          updatedComment,
        );
      }

      return { previousComment };
    },
    onError: (error, { commentId }, context) => {
      // Rollback on error
      if (context?.previousComment) {
        queryClient.setQueryData(
          queryKeys.comments.detail(commentId),
          context.previousComment,
        );
      }
      options.onError?.(error, { commentId }, context);
    },
    onSuccess: (data, { commentId }, context) => {
      // Invalidate comment detail to sync with server
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      // Invalidate comments lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.lists(),
      });

      options.onSuccess?.(data, { commentId }, context);
    },
    ...options,
  });
}
