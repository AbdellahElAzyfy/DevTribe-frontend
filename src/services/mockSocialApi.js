import {
  communities,
  currentUser,
  notifications,
  posts,
  savedPostIds,
  trendingTopics,
} from "../data/mockSocialData";

const DEFAULT_DELAY = 220;

function clone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function wait(delay = DEFAULT_DELAY) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

function withSavedState(post) {
  return {
    ...post,
    isSaved: savedPostIds.includes(post.id),
  };
}

export async function fetchFeedPosts() {
  await wait();
  return clone(posts.map(withSavedState));
}

export async function fetchCommunities() {
  await wait();
  return clone(communities);
}

export async function fetchCommunityBySlug(slug) {
  await wait();
  return clone(
    communities.find((community) => community.slug === slug) ?? null,
  );
}

export async function fetchCommunityPosts(slug) {
  await wait();
  return clone(posts.filter((post) => post.communitySlug === slug).map(withSavedState));
}

export async function fetchPostById(id) {
  await wait();
  const post = posts.find((entry) => entry.id === Number(id));
  return clone(post ? withSavedState(post) : null);
}

export async function fetchSavedPosts() {
  await wait();
  return clone(posts.filter((post) => savedPostIds.includes(post.id)).map(withSavedState));
}

export async function fetchNotifications() {
  await wait();
  return clone(notifications);
}

export async function fetchProfile() {
  await wait();
  return clone({
    ...currentUser,
    posts: posts
      .filter((post) => post.author.handle === currentUser.handle)
      .map(withSavedState),
    savedPosts: posts.filter((post) => savedPostIds.includes(post.id)).map(withSavedState),
  });
}

export async function toggleSavedPost(postId) {
  await wait();

  const normalizedPostId = Number(postId);
  const savedIndex = savedPostIds.indexOf(normalizedPostId);
  const isSaved = savedIndex === -1;

  if (isSaved) {
    savedPostIds.push(normalizedPostId);
  } else {
    savedPostIds.splice(savedIndex, 1);
  }

  const post = posts.find((entry) => entry.id === normalizedPostId);

  if (post) {
    post.isSaved = isSaved;
  }

  return clone({
    postId: normalizedPostId,
    isSaved,
  });
}

export async function searchContent(query) {
  await wait();

  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return {
      posts: clone(posts),
      communities: clone(communities),
      topics: clone(trendingTopics),
    };
  }

  return {
    posts: clone(
      posts.filter((post) => {
        const searchableText = [
          post.title,
          post.content,
          post.communityName,
          ...(post.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      }),
    ),
    communities: clone(
      communities.filter((community) => {
        const searchableText = [community.name, community.description]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      }),
    ),
    topics: clone(
      trendingTopics.filter((topic) =>
        topic.toLowerCase().includes(normalizedQuery),
      ),
    ),
  };
}

export async function createMockPost(input) {
  await wait();

  return clone({
    id: Date.now(),
    title: input.title,
    content: input.content,
    communityName: input.communityName || "devTribe",
    communitySlug: input.communitySlug || "reactjs",
    createdAt: "Just now",
    readTime: "1 min read",
    votes: 0,
    commentsCount: 0,
    isEdited: false,
    isSaved: false,
    tags: input.tags || [],
    author: {
      name: currentUser.name,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
    },
  });
}

export default {
  fetchFeedPosts,
  fetchCommunities,
  fetchCommunityBySlug,
  fetchCommunityPosts,
  fetchPostById,
  fetchSavedPosts,
  fetchNotifications,
  fetchProfile,
  toggleSavedPost,
  searchContent,
  createMockPost,
};
