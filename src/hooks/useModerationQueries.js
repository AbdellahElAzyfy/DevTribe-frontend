import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import * as moderationApi from "../services/apiModeration";

const STALE_TIME = 30 * 1000;

export function usePendingPosts(communityIdentifier, options = {}) {
  return useQuery({
    queryKey: queryKeys.moderation.pending(communityIdentifier ?? ""),
    queryFn: () => moderationApi.listPendingPosts(communityIdentifier),
    enabled: Boolean(communityIdentifier),
    staleTime: STALE_TIME,
    ...options,
  });
}

const removeFromPendingCache = (queryClient, postId) => {
  const idStr = String(postId);
  queryClient.setQueriesData(
    { queryKey: queryKeys.moderation.all() },
    (prev) => {
      if (!prev) return prev;
      if (Array.isArray(prev?.posts)) {
        return {
          ...prev,
          posts: prev.posts.filter((p) => String(p.id) !== idStr),
          total: Math.max(0, (prev.total ?? prev.posts.length) - 1),
        };
      }
      return prev;
    }
  );
};

export function useApprovePost(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: callerOnSuccess, ...rest } = options;

  return useMutation({
    mutationFn: (postId) => moderationApi.approvePost(postId),
    onSuccess: (data, postId, context) => {
      removeFromPendingCache(queryClient, postId);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.moderation.all() });
      callerOnSuccess?.(data, postId, context);
    },
    ...rest,
  });
}

export function useDeclinePost(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: callerOnSuccess, ...rest } = options;

  return useMutation({
    mutationFn: (postId) => moderationApi.declinePost(postId),
    onSuccess: (data, postId, context) => {
      removeFromPendingCache(queryClient, postId);
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.moderation.all() });
      callerOnSuccess?.(data, postId, context);
    },
    ...rest,
  });
}
