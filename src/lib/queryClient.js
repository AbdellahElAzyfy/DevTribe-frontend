import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale (1 minute default)
      // Override per-hook for different stale times
      staleTime: 1 * 60 * 1000,

      // Time data stays in cache before garbage collection (10 minutes)
      gcTime: 10 * 60 * 1000,

      // Don't refetch when window regains focus
      // (Can cause spam if user has many tabs open)
      refetchOnWindowFocus: false,

      // Retry failed requests once with exponential backoff
      retry: 1,

      // Exponential backoff for retries (1s, 2s, 4s, etc)
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30 * 1000),
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Same exponential backoff for mutations
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30 * 1000),
    },
  },
});
