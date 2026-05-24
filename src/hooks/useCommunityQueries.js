import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as communitiesApi from "../services/apiCommunities";
import { queryKeys } from "../lib/queryKeys";

/**
 * Query: List all communities with pagination and search
 * @param {Object} params - Query parameters (page, limit, search)
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useListCommunities(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.communities.list(params),
    queryFn: () => communitiesApi.listCommunities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Query: Get community by slug
 * @param {string} slug - Community slug
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useCommunity(slug, options = {}) {
  return useQuery({
    queryKey: queryKeys.communities.detail(slug),
    queryFn: () => communitiesApi.getCommunity(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
    ...options,
  });
}

/**
 * Mutation: Create community
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useCreateCommunity(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: (data) => communitiesApi.createCommunity(data),
    onSuccess: async (data, variables, context) => {
      // Invalidate the entire communities cache and wait for it
      await queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
        exact: false,
      });
      userOnSuccess?.(data, variables, context);
    },
    ...mutationOptions,
  });
}

/**
 * Mutation: Update community
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdateCommunity(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: ({ slug, data }) => communitiesApi.updateCommunity(slug, data),
    onSuccess: async (data, { slug }, context) => {
      // Invalidate the entire communities cache
      await queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
        exact: false,
      });
      userOnSuccess?.(data, { slug }, context);
    },
    ...mutationOptions,
  });
}

/**
 * Mutation: Join community
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useJoinCommunity(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: (slug) => communitiesApi.joinCommunity(slug),
    onSuccess: async (data, slug, context) => {
      // Update the specific community cache
      queryClient.setQueryData(
        queryKeys.communities.detail(slug),
        data.community,
      );
      // Invalidate all communities
      await queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
        exact: false,
      });
      userOnSuccess?.(data, slug, context);
    },
    ...mutationOptions,
  });
}

/**
 * Mutation: Leave community
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useLeaveCommunity(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: (slug) => communitiesApi.leaveCommunity(slug),
    onSuccess: async (data, slug, context) => {
      // Update the specific community cache
      queryClient.setQueryData(
        queryKeys.communities.detail(slug),
        data.community,
      );
      // Invalidate all communities
      await queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
        exact: false,
      });
      userOnSuccess?.(data, slug, context);
    },
    ...mutationOptions,
  });
}

/**
 * Mutation: Delete community (admin only)
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useDeleteCommunity(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: (slug) => communitiesApi.deleteCommunity(slug),
    onSuccess: async (data, slug, context) => {
      // Invalidate the entire communities cache
      await queryClient.invalidateQueries({
        queryKey: queryKeys.communities.all(),
        exact: false,
      });
      // Specifically remove the deleted community detail
      queryClient.removeQueries({
        queryKey: queryKeys.communities.detail(slug),
      });
      userOnSuccess?.(data, slug, context);
    },
    ...mutationOptions,
  });
}

/**
 * Mutation: Update member role
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdateMemberRole(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...mutationOptions } = options;

  return useMutation({
    mutationFn: ({ slug, memberId, role }) =>
      communitiesApi.updateMemberRole(slug, memberId, role),
    onSuccess: (data, { slug }, context) => {
      // Update the specific community cache
      queryClient.setQueryData(
        queryKeys.communities.detail(slug),
        data.community,
      );
      userOnSuccess?.(data, { slug }, context);
    },
    ...mutationOptions,
  });
}
