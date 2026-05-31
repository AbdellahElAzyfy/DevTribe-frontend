import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../services/apiAuth";
import { queryKeys } from "../lib/queryKeys";

/**
 * Query: Get current authenticated user
 * @param {Object} options - useQuery options
 * @returns {UseQueryResult}
 */
export function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
}

/**
 * Mutation: Register new user
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useRegister(options = {}) {
  return useMutation({
    mutationFn: (data) => authApi.register(data),
    ...options,
  });
}

/**
 * Mutation: Login user
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useLogin(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data, variables, context) => {
      // Invalidate user query and cache new user data
      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
      options.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Mutation: Logout user
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useLogout(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (data, variables, context) => {
      // Clear all cached data on logout
      queryClient.removeQueries({
        queryKey: queryKeys.auth.all(),
      });
      queryClient.clear();
      options.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Mutation: Update user profile
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useUpdateProfile(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    // data can be FormData (avatar upload) or a plain object — apiAuth handles both
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: (result, variables, context) => {
      const updatedUser = result?.user ?? result;
      // Update the current user cache so the profile reflects changes immediately
      queryClient.setQueryData(queryKeys.auth.currentUser(), updatedUser);
      options.onSuccess?.(result, variables, context);
    },
    ...options,
  });
}

/**
 * Mutation: Change password
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useChangePassword(options = {}) {
  return useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    ...options,
  });
}

/**
 * Mutation: Refresh session
 * @param {Object} options - useMutation options
 * @returns {UseMutationResult}
 */
export function useRefreshSession(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshSession(),
    onSuccess: (data, variables, context) => {
      // Update the current user cache
      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
      options.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
