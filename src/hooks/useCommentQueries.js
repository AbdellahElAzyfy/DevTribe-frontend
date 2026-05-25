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
 * Mutation: Create comment on post (also used for replies via parentCommentId)
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useCreateComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }) => commentsApi.createComment(postId, data),
    onSuccess: (data, { postId }, context) => {
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
 * Mutation: Vote on a comment (toggle semantics, optimistic).
 *
 * Backend contract: POST /comments/:id/vote with { value: 1 | -1 }.
 * Re-sending the same value clears the vote (server returns value: 0).
 *
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useVoteComment(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, value }) =>
      votesApi.voteComment(commentId, { value }),
    onMutate: async ({ postId, commentId, value }) => {
      const listKey = ["comments", "list", "byPost", String(postId)];

      await queryClient.cancelQueries({ queryKey: listKey });

      const snapshots = queryClient.getQueriesData({ queryKey: listKey });

      queryClient.setQueriesData({ queryKey: listKey }, (oldData) => {
        if (!oldData || !Array.isArray(oldData.comments)) return oldData;

        const nextComments = oldData.comments.map((comment) => {
          if (String(comment.id) !== String(commentId)) return comment;

          const currentUserVote = Number(comment.userVote ?? 0);
          const nextUserVote = currentUserVote === value ? 0 : value;
          const voteDelta = nextUserVote - currentUserVote;
          const nextVoteCount = Number(comment.voteCount ?? 0) + voteDelta;

          return {
            ...comment,
            userVote: nextUserVote,
            voteCount: nextVoteCount,
          };
        });

        return { ...oldData, comments: nextComments };
      });

      return { snapshots };
    },
    onError: (error, variables, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      options.onError?.(error, variables, context);
    },
    onSuccess: (data, { postId, commentId }, context) => {
      // Reconcile with the server's authoritative voteCount and value.
      // Note: we intentionally do not invalidate the comments list — the
      // backend's list response doesn't carry `userVote`, so a refetch would
      // erase the client-tracked vote highlight.
      const serverVote = data?.vote;
      if (serverVote && postId) {
        const listKey = ["comments", "list", "byPost", String(postId)];
        queryClient.setQueriesData({ queryKey: listKey }, (oldData) => {
          if (!oldData || !Array.isArray(oldData.comments)) return oldData;
          const nextComments = oldData.comments.map((comment) => {
            if (String(comment.id) !== String(commentId)) return comment;
            return {
              ...comment,
              userVote: Number(serverVote.value ?? 0),
              voteCount:
                serverVote.voteCount != null
                  ? Number(serverVote.voteCount)
                  : comment.voteCount,
            };
          });
          return { ...oldData, comments: nextComments };
        });
      }
      options.onSuccess?.(data, { postId, commentId }, context);
    },
  });
}
