import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import * as searchApi from "../services/apiSearch";

const STALE_TIME = 30 * 1000;

const hasQuery = (q) => typeof q === "string" && q.trim().length > 0;

export function useSearchAll(q) {
  return useQuery({
    queryKey: queryKeys.search.combined(q),
    queryFn: () => searchApi.searchAll(q),
    enabled: hasQuery(q),
    staleTime: STALE_TIME,
  });
}

export function useSearchPosts({ q, page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: queryKeys.search.posts({ q, page, limit }),
    queryFn: () => searchApi.searchPosts({ q, page, limit }),
    enabled: hasQuery(q),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useSearchCommunities({ q, page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: queryKeys.search.communities({ q, page, limit }),
    queryFn: () => searchApi.searchCommunities({ q, page, limit }),
    enabled: hasQuery(q),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useSearchUsers({ q, page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: queryKeys.search.users({ q, page, limit }),
    queryFn: () => searchApi.searchUsers({ q, page, limit }),
    enabled: hasQuery(q),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}
