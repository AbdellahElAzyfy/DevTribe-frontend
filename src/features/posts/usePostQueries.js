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

export function useVotePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, value }) => {
      const response = await apiClient.post(`/posts/${postId}/vote`, { value });
      return response.data;
    },
    onSettled: (_data, _error, variables) => {
      if (!variables?.postId) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
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
