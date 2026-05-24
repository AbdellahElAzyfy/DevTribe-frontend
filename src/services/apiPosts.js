import apiClient from "./apiClient";

/**
 * List all posts (public, paginated)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.sortBy - Sort by: "trending", "recent", "popular"
 * @param {string} params.community - Filter by community slug
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} - { posts: [], pagination: {} }
 */
export async function listPosts(params = {}) {
  try {
    const response = await apiClient.get("/posts", { params });
    return response.data?.posts || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get personalized feed for authenticated user
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.sortBy - Sort by: "trending", "recent", "popular"
 * @returns {Promise<Object>} - { posts: [], pagination: {} }
 */
export async function getFeed(params = {}) {
  try {
    const response = await apiClient.get("/posts/feed", { params });
    return response.data?.posts || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get user's draft posts
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<Object>} - { posts: [], pagination: {} }
 */
export async function getMyDrafts(params = {}) {
  try {
    const response = await apiClient.get("/posts/me/drafts", { params });
    return response.data?.posts || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} - { post: {} }
 */
export async function getPost(postId) {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data?.post || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Create a new post
 * @param {FormData|Object} data - Post data
 * @param {string} data.title - Post title
 * @param {string} data.content - Post content
 * @param {string} data.communitySlug - Community slug
 * @param {File} data.image - Image file (optional)
 * @param {boolean} data.isDraft - Is draft (default: false)
 * @returns {Promise<Object>} - { message: "", post: {} }
 */
export async function createPost(data) {
  try {
    // If data is FormData, let axios handle it; if not, convert to JSON
    const response = await apiClient.post("/posts", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update a post
 * @param {string} postId - Post ID
 * @param {FormData|Object} data - Updated post data
 * @returns {Promise<Object>} - { message: "", post: {} }
 */
export async function updatePost(postId, data) {
  try {
    const response = await apiClient.patch(`/posts/${postId}`, data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Delete a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} - { message: "" }
 */
export async function deletePost(postId) {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Toggle save post status
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} - { isSaved: boolean }
 */
export async function toggleSavePost(postId) {
  try {
    const response = await apiClient.post(`/posts/${postId}/save`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * List saved posts for authenticated user
 * @returns {Promise<Object>} - { posts: [] }
 */
export async function listSavedPosts() {
  try {
    const response = await apiClient.get("/posts/saved");
    return response.data?.posts || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default {
  listPosts,
  getFeed,
  getMyDrafts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleSavePost,
  listSavedPosts,
};
