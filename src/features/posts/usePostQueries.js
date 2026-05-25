import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { useFeed, usePost } from "../../hooks/usePostQueries";
import apiClient from "../../services/apiClient";
import { toggleSavePost } from "../../services/apiPosts";

function updateSavedStateInList(posts, postId, isSaved) {
  if (!Array.isArray(posts)) {
    return posts;
  }

  return posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    return {
      ...post,
      isSaved,
    };
  });
}

export function useFeedPostsQuery(params = { sortBy: "newest" }, options = {}) {
  return useFeed(params, options);
}

export function usePopularPostsQuery(options = {}) {
  return useFeed({ sortBy: "top" }, options);
}

export function usePostByIdQuery(id, options = {}) {
  return usePost(id, options);
}

/**
 * Apply a (post) => post transform to every post-shaped value held in the
 * React Query cache: detail (single object), and list/feed (array of posts).
 */
function patchPostEverywhere(queryClient, postId, transform) {
  const idStr = String(postId);

  queryClient.setQueriesData({ queryKey: queryKeys.posts.all() }, (oldData) => {
    if (!oldData) return oldData;

    // Single post detail
    if (!Array.isArray(oldData) && oldData.id != null) {
      return String(oldData.id) === idStr ? transform(oldData) : oldData;
    }

    // Direct array of posts (most list/feed responses are unwrapped this way)
    if (Array.isArray(oldData)) {
      let changed = false;
      const next = oldData.map((post) => {
        if (String(post.id) !== idStr) return post;
        changed = true;
        return transform(post);
      });
      return changed ? next : oldData;
    }

    // Defensive: paginated wrapper { posts: [...] }
    if (Array.isArray(oldData?.posts)) {
      let changed = false;
      const nextPosts = oldData.posts.map((post) => {
        if (String(post.id) !== idStr) return post;
        changed = true;
        return transform(post);
      });
      return changed ? { ...oldData, posts: nextPosts } : oldData;
    }

    return oldData;
  });
}

/**
 * Mutation: Vote on a post (toggle semantics, optimistic).
 *
 * The React Query cache is the single source of truth for vote state. We
 * optimistically patch every post-shaped cache entry, snapshot for rollback,
 * and reconcile with the server's authoritative voteCount/value on success.
 *
 * Backend contract: POST /posts/:id/vote with { value: 1 | -1 }.
 * Re-sending the same value clears it (server returns value: 0). The vote
 * payload includes the new voteCount.
 */
export function useVotePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, value }) => {
      const response = await apiClient.post(`/posts/${postId}/vote`, { value });
      return response.data;
    },
    onMutate: async ({ postId, value }) => {
      if (!postId) return {};

      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all() });

      const snapshots = queryClient.getQueriesData({
        queryKey: queryKeys.posts.all(),
      });

      patchPostEverywhere(queryClient, postId, (post) => {
        const currentUserVote = Number(post.userVote ?? 0);
        const nextUserVote = currentUserVote === value ? 0 : value;
        const voteDelta = nextUserVote - currentUserVote;
        const nextVoteCount = Number(post.voteCount ?? 0) + voteDelta;
        return { ...post, userVote: nextUserVote, voteCount: nextVoteCount };
      });

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (!context?.snapshots) return;
      context.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (data, { postId }) => {
      const serverVote = data?.vote;
      if (!serverVote || !postId) return;

      patchPostEverywhere(queryClient, postId, (post) => ({
        ...post,
        userVote: Number(serverVote.value ?? 0),
        voteCount:
          serverVote.voteCount != null
            ? Number(serverVote.voteCount)
            : post.voteCount,
      }));
    },
  });
}

export function useToggleSavedPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => toggleSavePost(postId),
    onMutate: async (postId) => {
      const stringPostId = String(postId);

      // Cancel outgoing refetches
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.posts.all() }),
        queryClient.cancelQueries({ queryKey: queryKeys.saved.posts() }),
      ]);

      // Save previous values for rollback
      const previousSavedPosts = queryClient.getQueryData(queryKeys.saved.posts());

      // 1. Update ALL post lists (Feed, Community, Popular)
      queryClient.setQueriesData({ queryKey: queryKeys.posts.all() }, (oldData) => {
        // Handle both list structure { posts: [...] } and direct array if applicable
        if (!oldData) return oldData;

        // If it's a paginated response with a posts array
        if (oldData.posts && Array.isArray(oldData.posts)) {
          return {
            ...oldData,
            posts: oldData.posts.map((post) =>
              String(post.id) === stringPostId
                ? { ...post, isSaved: !post.isSaved }
                : post
            ),
          };
        }

        // If it's a single post detail object
        if (String(oldData.id) === stringPostId) {
          return { ...oldData, isSaved: !oldData.isSaved };
        }

        return oldData;
      });

      // 2. Update the specific Saved Posts list
      if (previousSavedPosts) {
        const isCurrentlySaved = previousSavedPosts.some(p => String(p.id) === stringPostId);
        if (isCurrentlySaved) {
          queryClient.setQueryData(queryKeys.saved.posts(), previousSavedPosts.filter(p => String(p.id) !== stringPostId));
        } else {
          // If we are saving, we might not have the full post object here, but invalidation will fetch it later
          // For now, let's just let it be invalidated on settle if we can't find the post to add
        }
      }

      return { previousSavedPosts, stringPostId };
    },
    onError: (_error, _postId, context) => {
      if (!context) return;
      queryClient.setQueryData(queryKeys.saved.posts(), context.previousSavedPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.posts() });
    },
  });
}
