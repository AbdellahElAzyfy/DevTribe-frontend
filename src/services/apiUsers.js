import apiClient from "./apiClient";

export const getUserByUsername = async (username) => {
  // Encode so usernames containing spaces or other special characters
  // produce a valid URL path (Express decodes it back on the server).
  const res = await apiClient.get(`/users/${encodeURIComponent(username)}`);
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await apiClient.get(`/users/id/${encodeURIComponent(userId)}`);
  return res.data;
};
