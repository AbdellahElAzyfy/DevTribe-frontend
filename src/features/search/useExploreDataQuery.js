import { queryKeys } from "../../lib/queryKeys";
import { useListPosts } from "../../hooks/usePostQueries";

export function useExploreDataQuery(query = "", options = {}) {
  const normalizedQuery = query.trim();

  const params = normalizedQuery ? { search: normalizedQuery } : {};

  return useListPosts(params, {
    queryKey: normalizedQuery
      ? queryKeys.search.query(normalizedQuery)
      : queryKeys.search.explore,
    ...options,
  });
}
