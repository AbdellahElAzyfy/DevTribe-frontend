/**
 * EXAMPLE: Communities List with Join/Leave
 *
 * This shows implementation of:
 * - Fetching communities with pagination and search
 * - Join/Leave community mutations
 * - Loading states
 * - Optimistic updates for join/leave
 *
 * Located: features/communities/pages/CommunitiesPage.jsx
 */

import { useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import {
  useListCommunities,
  useJoinCommunity,
  useLeaveCommunity,
} from "../../../hooks/useCommunityQueries";
import { useCurrentUser } from "../../../hooks/useAuthQueries";
import { getErrorMessage } from "../../../utils/errorHandler";

export function CommunitiesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const limit = 12;

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  // Fetch communities
  const {
    data: communitiesData,
    isLoading: isLoadingCommunities,
    error: communitiesError,
  } = useListCommunities(
    {
      page,
      limit,
      search: debouncedSearch,
    },
    {
      keepPreviousData: true, // Keep showing old data while fetching new
    },
  );

  // Get current user to check membership
  const { data: currentUser } = useCurrentUser();

  // Join community mutation
  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity({
    onSuccess: (data, slug) => {
      console.log("Successfully joined:", slug);
      // Cache is automatically updated by React Query
    },
    onError: (error, slug) => {
      alert(`Failed to join community: ${getErrorMessage(error)}`);
    },
  });

  // Leave community mutation
  const { mutate: leaveCommunity, isPending: isLeaving } = useLeaveCommunity({
    onSuccess: (data, slug) => {
      console.log("Successfully left:", slug);
    },
    onError: (error, slug) => {
      alert(`Failed to leave community: ${getErrorMessage(error)}`);
    },
  });

  // Handle search input
  const handleSearch = (value) => {
    setSearchInput(value);
    setPage(1); // Reset to first page on search
  };

  // Check if user is a member of a community
  const isMember = (community) => {
    if (!currentUser) return false;
    return community.members?.some((m) => m.userId === currentUser.id);
  };

  // Error state
  if (communitiesError && !communitiesData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">
          Failed to load communities
        </h3>
        <p className="text-red-700 text-sm mb-4">
          {getErrorMessage(communitiesError)}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const communities = communitiesData?.communities || [];
  const pagination = communitiesData?.pagination;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
        <p className="text-gray-600">
          Join communities to see posts from members and engage with the
          community
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading State */}
      {isLoadingCommunities && !communities.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CommunitySkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingCommunities && !communities.length && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No communities found</p>
          <p className="text-gray-400 text-sm">
            {debouncedSearch
              ? "Try a different search term"
              : "Check back later for new communities"}
          </p>
        </div>
      )}

      {/* Communities Grid */}
      {communities.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {communities.map((community) => {
              const memberStatus = isMember(community);

              return (
                <div
                  key={community.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  {/* Community Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        r/{community.name}
                      </h3>
                      <p className="text-sm text-gray-600">{community.slug}</p>
                    </div>

                    {/* Icon/Badge */}
                    {community.icon && (
                      <img
                        src={community.icon}
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 ml-2"
                      />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 py-4 border-t border-b border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {community.memberCount || 0}
                      </span>
                      <span className="ml-1">members</span>
                    </div>

                    <div>
                      <span className="text-gray-400">•</span>
                      <span className="ml-2">
                        Created {formatDate(community.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Member Roles */}
                  {community.members && community.members.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 font-semibold mb-2">
                        Moderators
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {community.members
                          .filter((m) => m.role !== "member")
                          .slice(0, 3)
                          .map((member) => (
                            <span
                              key={member.userId}
                              className={`text-xs px-2 py-1 rounded ${
                                member.role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {member.role}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Join/Leave Button */}
                  {currentUser ? (
                    <button
                      onClick={() => {
                        if (memberStatus) {
                          leaveCommunity(community.slug);
                        } else {
                          joinCommunity(community.slug);
                        }
                      }}
                      disabled={isJoining || isLeaving}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        memberStatus
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isJoining || isLeaving
                        ? memberStatus
                          ? "Leaving..."
                          : "Joining..."
                        : memberStatus
                          ? "✓ Joined"
                          : "Join Community"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Sign in to join
                    </button>
                  )}

                  {/* View Community Link */}
                  <button className="w-full mt-2 py-2 px-4 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition">
                    View Community
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <div className="flex justify-center items-center gap-2 py-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoadingCommunities}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({
                  length: Math.min(5, Math.ceil(pagination.total / limit)),
                }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded font-medium transition ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  page >= Math.ceil(pagination.total / limit) ||
                  isLoadingCommunities
                }
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(pagination.total / limit)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Skeleton loader for community card
 */
function CommunitySkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>

      <div className="h-10 bg-gray-200 rounded mb-2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return `${Math.floor(diffDays / 365)} years ago`;
}
