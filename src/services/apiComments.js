import apiClient from "./apiClient";

/**
 * List comments for a post (paginated)
 * @param {string} postId - Post ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.sortBy - Sort by: "trending", "recent"
 * @returns {Promise<Object>} - { comments: [], pagination: {} }
 */
export async function listComments(postId, params = {}) {
  try {
    const response = await apiClient.get(`/comments/post/${postId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Create a comment on a post
 * @param {string} postId - Post ID
 * @param {Object} data - Comment data
 * @param {string} data.content - Comment content
 * @returns {Promise<Object>} - { message: "", comment: {} }
 */
export async function createComment(postId, data) {
  try {
    const response = await apiClient.post(`/comments/post/${postId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update a comment
 * @param {string} commentId - Comment ID
 * @param {Object} data - Updated comment data
 * @param {string} data.content - New comment content
 * @returns {Promise<Object>} - { message: "", comment: {} }
 */
export async function updateComment(commentId, data) {
  try {
    const response = await apiClient.patch(`/comments/${commentId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} - { message: "" }
 */
export async function deleteComment(commentId) {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default {
  listComments,
  createComment,
  updateComment,
  deleteComment,
};
