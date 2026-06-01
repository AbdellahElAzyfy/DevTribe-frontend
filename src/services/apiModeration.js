import apiClient from "./apiClient";

export const listPendingPosts = async (communityIdentifier) => {
  const res = await apiClient.get(`/posts/community/${communityIdentifier}/pending`);
  return res.data;
};

export const approvePost = async (postId) => {
  const res = await apiClient.patch(`/posts/${postId}/approve`);
  return res.data;
};

export const declinePost = async (postId) => {
  const res = await apiClient.delete(`/posts/${postId}/decline`);
  return res.data;
};
