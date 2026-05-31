import apiClient from "./apiClient";

export const getUserByUsername = async (username) => {
  const res = await apiClient.get(`/users/${username}`);
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await apiClient.get(`/users/id/${userId}`);
  return res.data;
};
