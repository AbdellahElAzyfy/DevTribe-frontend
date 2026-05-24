import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { listSavedPosts } from "../../services/apiPosts";

export function useSavedPostsQuery() {
  return useQuery({
    queryKey: queryKeys.saved.posts(),
    queryFn: listSavedPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
