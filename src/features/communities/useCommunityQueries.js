import {
  useListCommunities,
  useCommunity,
  useJoinCommunity,
  useLeaveCommunity,
} from "../../hooks/useCommunityQueries";
import { useListPosts } from "../../hooks/usePostQueries";

// Bridge feature hooks to the centralized hooks
export function useCommunitiesQuery(params = {}, options = {}) {
  return useListCommunities(params, options);
}

export function useCommunityQuery(slug, options = {}) {
  return useCommunity(slug, options);
}

export function useCommunityPostsQuery(slug, options = {}) {
  return useListPosts({ community: slug }, options);
}

export function useJoinCommunityMutation(options = {}) {
  return useJoinCommunity(options);
}

export function useLeaveCommunityMutation(options = {}) {
  return useLeaveCommunity(options);
}

// Re-export original mutation names for backward compatibility if needed
export { useJoinCommunity, useLeaveCommunity };
