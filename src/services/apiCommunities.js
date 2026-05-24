import apiClient from "./apiClient";

/**
 * List all communities
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} - { communities: [], pagination: {} }
 */
export async function listCommunities(params = {}) {
  try {
    const response = await apiClient.get("/communities", { params });
    return response.data?.communities || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Get community by slug
 * @param {string} slug - Community slug
 * @returns {Promise<Object>} - { community: {} }
 */
export async function getCommunity(slug) {
  try {
    const response = await apiClient.get(`/communities/${slug}`);
    return response.data?.community || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Create a new community
 * @param {Object} data - Community data
 * @param {string} data.name - Community name
 * @param {string} data.description - Community description
 * @returns {Promise<Object>} - { message: "", community: {} }
 */
export async function createCommunity(data) {
  try {
    const response = await apiClient.post("/communities", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update community details
 * @param {string} slug - Community slug
 * @param {Object} data - Update data
 * @returns {Promise<Object>} - { message: "", community: {} }
 */
export async function updateCommunity(slug, data) {
  try {
    const response = await apiClient.patch(`/communities/${slug}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Join a community
 * @param {string} slug - Community slug
 * @returns {Promise<Object>} - { message: "", community: {} }
 */
export async function joinCommunity(slug) {
  try {
    const response = await apiClient.post(`/communities/${slug}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Leave a community
 * @param {string} slug - Community slug
 * @returns {Promise<Object>} - { message: "", community: {} }
 */
export async function leaveCommunity(slug) {
  try {
    const response = await apiClient.post(`/communities/${slug}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Delete a community (admin only)
 * @param {string} slug - Community slug
 * @returns {Promise<Object>} - { message: "" }
 */
export async function deleteCommunity(slug) {
  try {
    const response = await apiClient.delete(`/communities/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Update member role in a community (admin/moderator only)
 * @param {string} slug - Community slug
 * @param {string} memberId - User ID
 * @param {string} role - Role: "admin", "moderator", "member"
 * @returns {Promise<Object>} - { message: "", community: {} }
 */
export async function updateMemberRole(slug, memberId, role) {
  try {
    const response = await apiClient.patch(
      `/communities/${slug}/members/${memberId}/role`,
      {
        role,
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default {
  listCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
  updateMemberRole,
};
