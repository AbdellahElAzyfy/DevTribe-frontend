/**
 * React Query Key Factory
 *
 * Centralized query key structure for all API calls
 * Follows TanStack recommendations for query key organization
 *
 * Benefits:
 * - Easy cache invalidation
 * - Type-safe with autocomplete
 * - Consistent naming convention
 * - Scalable structure
 */

export const queryKeys = {
  // ============ AUTH ============
  auth: {
    all: () => ["auth"],
    currentUser: () => ["auth", "currentUser"],
    session: () => ["auth", "session"],
  },

  // ============ COMMUNITIES ============
  communities: {
    all: () => ["communities"],
    lists: () => [...queryKeys.communities.all(), "list"],
    list: (params) => [...queryKeys.communities.lists(), params],
    details: () => [...queryKeys.communities.all(), "detail"],
    detail: (slug) => [...queryKeys.communities.details(), slug],
    members: (slug) => [...queryKeys.communities.detail(slug), "members"],
  },

  // ============ POSTS ============
  posts: {
    all: () => ["posts"],
    lists: () => [...queryKeys.posts.all(), "list"],
    list: (params) => [...queryKeys.posts.lists(), params],
    feed: (params) => ["posts", "feed", params],
    drafts: (params) => ["posts", "drafts", params],
    details: () => [...queryKeys.posts.all(), "detail"],
    detail: (id) => [...queryKeys.posts.details(), String(id)],
  },

  // ============ COMMENTS ============
  comments: {
    all: () => ["comments"],
    lists: () => [...queryKeys.comments.all(), "list"],
    listByPost: (postId, params) => [
      ...queryKeys.comments.lists(),
      "byPost",
      String(postId),
      params,
    ],
    details: () => [...queryKeys.comments.all(), "detail"],
    detail: (id) => [...queryKeys.comments.details(), String(id)],
  },

  // ============ VOTES ============
  votes: {
    all: () => ["votes"],
    postVote: (postId) => [...queryKeys.votes.all(), "post", String(postId)],
    commentVote: (commentId) => [
      ...queryKeys.votes.all(),
      "comment",
      String(commentId),
    ],
  },

  // ============ SEARCH ============
  search: {
    all: () => ["search"],
    query: (value) => [...queryKeys.search.all(), "query", value],
    combined: (q) => [...queryKeys.search.all(), "combined", q],
    posts: (params) => [...queryKeys.search.all(), "posts", params],
    communities: (params) => [...queryKeys.search.all(), "communities", params],
    users: (params) => [...queryKeys.search.all(), "users", params],
  },

  // ============ SAVED POSTS ============
  saved: {
    all: () => ["saved"],
    posts: () => [...queryKeys.saved.all(), "posts"],
  },

  // ============ MODERATION ============
  moderation: {
    all: () => ["moderation"],
    pending: (communityIdentifier) => [
      ...queryKeys.moderation.all(),
      "pending",
      String(communityIdentifier),
    ],
  },

  // ============ NOTIFICATIONS ============
  notifications: {
    all: () => ["notifications"],
    lists: () => [...queryKeys.notifications.all(), "list"],
    list: (params) => [...queryKeys.notifications.lists(), params],
  },

  // ============ MESSAGES ============
  messages: {
    all: () => ["messages"],
    conversations: () => [...queryKeys.messages.all(), "conversations"],
    conversation: (userId) => [...queryKeys.messages.all(), "conversation", String(userId)],
    unreadCount: () => [...queryKeys.messages.all(), "unread-count"],
  },

  // ============ USERS ============
  users: {
    all: () => ["users"],
    profiles: () => [...queryKeys.users.all(), "profile"],
    profile: (username) => [...queryKeys.users.profiles(), username],
  },
};
