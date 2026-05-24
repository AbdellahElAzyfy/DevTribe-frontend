import apiClient from "./apiClient";

/**
 * Vote on a post (upvote, downvote, or remove)
 * @param {string} postId - Post ID
 * @param {Object} data - Vote data
 * @param {string} data.value - Vote value: "up", "down", or null to remove
 * @returns {Promise<Object>} - { message: "", vote: {} }
 */
export async function votePost(postId, data) {
  try {
    const response = await apiClient.post(`/posts/${postId}/vote`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Vote on a comment (upvote, downvote, or remove)
 * @param {string} commentId - Comment ID
 * @param {Object} data - Vote data
 * @param {string} data.value - Vote value: "up", "down", or null to remove
 * @returns {Promise<Object>} - { message: "", vote: {} }
 */
export async function voteComment(commentId, data) {
  try {
    const response = await apiClient.post(`/comments/${commentId}/vote`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default {
  votePost,
  voteComment,
};
