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
  // Keep the caller's onSuccess out of the spread so it can't override ours.
  const { onSuccess: callerOnSuccess, ...rest } = options;

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

      callerOnSuccess?.(data, { postId }, context);
    },
    ...rest,
  });
}

/**
 * Mutation: Update comment
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdateComment(options = {}) {
  const queryClient = useQueryClient();
  // Keep the caller's onSuccess out of the spread so it can't override ours.
  const { onSuccess: callerOnSuccess, ...rest } = options;

  return useMutation({
    mutationFn: ({ commentId, data }) =>
      commentsApi.updateComment(commentId, data),
    onSuccess: (data, { commentId }, context) => {
      const updated = data.comment;

      // Update the specific comment cache
      queryClient.setQueryData(queryKeys.comments.detail(commentId), updated);

      // Patch the edited comment's content IN PLACE across every comments list.
      // The list cache is a FLAT array (buildCommentTree nests only at render),
      // so a single map by id is enough. Patching instead of invalidating
      // preserves client-tracked fields the list response omits, like userVote.
      const newContent = updated?.content;
      queryClient.setQueriesData(
        { queryKey: queryKeys.comments.lists() },
        (oldData) => {
          if (!oldData || !Array.isArray(oldData.comments)) return oldData;

          const nextComments = oldData.comments.map((comment) =>
            String(comment.id) === String(commentId)
              ? { ...comment, content: newContent }
              : comment,
          );

          return { ...oldData, comments: nextComments };
        },
      );

      callerOnSuccess?.(data, { commentId }, context);
    },
    ...rest,
  });
}

/**
 * Mutation: Delete comment
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
/**
 * Decrement a post's `commentCount` directly in every posts cache entry
 * (detail object, unwrapped array, or { posts: [...] } wrapper). We patch the
 * cache instead of invalidating because invalidation only refetches *mounted*
 * queries — so the feed badge could stay stale until a hard refresh.
 */
function decrementPostCommentCount(queryClient, postId, amount) {
  if (!postId || amount <= 0) return;
  const idStr = String(postId);

  const dec = (post) => {
    if (String(post.id) !== idStr) return post;
    const current = Number(post.commentCount ?? post.commentsCount ?? 0);
    const next = Math.max(0, current - amount);
    return { ...post, commentCount: next, commentsCount: next };
  };

  queryClient.setQueriesData({ queryKey: queryKeys.posts.all() }, (oldData) => {
    if (!oldData) return oldData;

    // Single post detail
    if (!Array.isArray(oldData) && oldData.id != null) {
      return dec(oldData);
    }
    // Unwrapped array of posts
    if (Array.isArray(oldData)) {
      return oldData.map(dec);
    }
    // Paginated wrapper { posts: [...] }
    if (Array.isArray(oldData?.posts)) {
      return { ...oldData, posts: oldData.posts.map(dec) };
    }
    return oldData;
  });
}

export function useDeleteComment(options = {}) {
  const queryClient = useQueryClient();
  // Pull the caller's callbacks OUT of options so spreading `...rest` can't
  // override the cache-patching handlers below. (The previous `...options`
  // spread silently replaced this hook's onSuccess, so deletions never
  // updated the cache — the UI only refreshed on a hard reload.)
  const { onSuccess: callerOnSuccess, ...rest } = options;

  return useMutation({
    // Accept either { postId, commentId } (preferred) or a bare commentId.
    mutationFn: (variables) => {
      const commentId =
        typeof variables === "object" ? variables.commentId : variables;
      return commentsApi.deleteComment(commentId);
    },
    onSuccess: (data, variables, context) => {
      const commentId =
        typeof variables === "object" ? variables.commentId : variables;
      const postId = typeof variables === "object" ? variables.postId : null;
      const idStr = String(commentId);

      // Remove the detail entry
      queryClient.removeQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      // Patch every comments list IN PLACE: drop the deleted comment AND any of
      // its replies (deleting a parent removes its subtree server-side), then
      // shrink `total` to match. Track how many we removed so we can decrement
      // the post's comment count by the same amount.
      let removedTotal = 0;
      queryClient.setQueriesData(
        { queryKey: queryKeys.comments.lists() },
        (oldData) => {
          if (!oldData || !Array.isArray(oldData.comments)) return oldData;

          const nextComments = oldData.comments.filter(
            (comment) =>
              String(comment.id) !== idStr &&
              String(comment.parentComment ?? "") !== idStr,
          );

          const removed = oldData.comments.length - nextComments.length;
          removedTotal = Math.max(removedTotal, removed);
          const nextTotal = Math.max(0, Number(oldData.total ?? 0) - removed);

          return { ...oldData, comments: nextComments, total: nextTotal };
        },
      );

      // Directly decrement the post's comment-count badge in the posts cache.
      // Fall back to 1 if the list cache wasn't present to count from.
      decrementPostCommentCount(queryClient, postId, removedTotal || 1);

      // Backfill the page in the background: removing a visible comment leaves
      // the cached page smaller than its `limit`, so refetch to pull up the
      // next comment and keep the "View more (N left)" math accurate. The
      // in-place patch above already updated the UI instantly.
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.lists(),
      });

      callerOnSuccess?.(data, variables, context);
    },
    ...rest,
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
