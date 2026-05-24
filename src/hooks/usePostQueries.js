import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as postsApi from "../services/apiPosts";
import * as votesApi from "../services/apiVotes";
import { queryKeys } from "../lib/queryKeys";

/**
 * Query: List all posts (public feed with sorting and filtering)
 * @param {Object} params - Query parameters (page, limit, sortBy, community, search)
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useListPosts(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => postsApi.listPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Query: Get personalized feed (authenticated users only)
 * @param {Object} params - Query parameters (page, limit, sortBy)
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useFeed(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.posts.feed(params),
    queryFn: () => postsApi.getFeed(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Query: Get user's draft posts
 * @param {Object} params - Query parameters (page, limit)
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useMyDrafts(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.posts.drafts(params),
    queryFn: () => postsApi.getMyDrafts(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
}

/**
 * Query: Get single post by ID
 * @param {string} postId - Post ID
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function usePost(postId, options = {}) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => postsApi.getPost(postId),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!postId,
    ...options,
  });
}

/**
 * Mutation: Create new post
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useCreatePost(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postsApi.createPost(data),
    onSuccess: (data, variables, context) => {
      // Refresh every posts query shape so the new post appears immediately.
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all(),
      });

      // Keep community-derived views fresh as well.
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
      });

      options.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Mutation: Update post
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdatePost(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }) => postsApi.updatePost(postId, data),
    onSuccess: (data, { postId }, context) => {
      const updatedPost = data.post;

      // Update the specific post cache
      queryClient.setQueryData(queryKeys.posts.detail(postId), updatedPost);

      // Invalidate lists as post visibility might have changed
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.feed(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.drafts(),
      });

      options.onSuccess?.(data, { postId }, context);
    },
    ...options,
  });
}

/**
 * Mutation: Delete post
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useDeletePost(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => postsApi.deletePost(postId),
    onSuccess: (data, postId, context) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.feed(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.drafts(),
      });

      options.onSuccess?.(data, postId, context);
    },
    ...options,
  });
}

/**
 * Mutation: Vote on post (with optimistic updates)
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useVotePost(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, value }) => votesApi.votePost(postId, { value }),
    onMutate: ({ postId, value }) => {
      // Save previous state for rollback
      const previousPost = queryClient.getQueryData(
        queryKeys.posts.detail(postId),
      );

      if (previousPost) {
        // Optimistic update
        const updatedPost = {
          ...previousPost,
          votes: {
            ...previousPost.votes,
            userVote: value,
            upvotes:
              value === "up"
                ? previousPost.votes.upvotes + 1
                : value === null && previousPost.votes.userVote === "up"
                  ? previousPost.votes.upvotes - 1
                  : previousPost.votes.upvotes,
            downvotes:
              value === "down"
                ? previousPost.votes.downvotes + 1
                : value === null && previousPost.votes.userVote === "down"
                  ? previousPost.votes.downvotes - 1
                  : previousPost.votes.downvotes,
          },
        };

        queryClient.setQueryData(queryKeys.posts.detail(postId), updatedPost);
      }

      return { previousPost };
    },
    onError: (error, { postId }, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(
          queryKeys.posts.detail(postId),
          context.previousPost,
        );
      }
      options.onError?.(error, { postId }, context);
    },
    onSuccess: (data, { postId }, context) => {
      // Invalidate post detail to sync with server
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      // Invalidate lists as vote counts might have changed ordering
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.feed(),
      });
      options.onSuccess?.(data, { postId }, context);
    },
    ...options,
  });
}
