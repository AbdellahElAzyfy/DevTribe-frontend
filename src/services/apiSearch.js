import apiClient from "./apiClient";

export const searchAll = async (q) => {
  const res = await apiClient.get("/search", { params: { q } });
  return res.data;
};

export const searchPosts = async ({ q, page = 1, limit = 20 }) => {
  const res = await apiClient.get("/search/posts", { params: { q, page, limit } });
  return res.data;
};

export const searchCommunities = async ({ q, page = 1, limit = 20 }) => {
  const res = await apiClient.get("/search/communities", { params: { q, page, limit } });
  return res.data;
};

export const searchUsers = async ({ q, page = 1, limit = 20 }) => {
  const res = await apiClient.get("/search/users", { params: { q, page, limit } });
  return res.data;
};
