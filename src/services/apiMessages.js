import apiClient from "./apiClient";

export const createMessage = async ({ recipientId, content }) => {
  const res = await apiClient.post("/messages", { recipientId, content });
  return res.data;
};

export const getConversations = async ({ page = 1, limit = 20 } = {}) => {
  const res = await apiClient.get("/messages", { params: { page, limit } });
  return res.data;
};

export const getConversation = async (userId, { page = 1, limit = 50 } = {}) => {
  const res = await apiClient.get(`/messages/conversation/${userId}`, { params: { page, limit } });
  return res.data;
};

export const markMessageRead = async (messageId) => {
  const res = await apiClient.patch(`/messages/${messageId}/read`);
  return res.data;
};

export const markConversationRead = async (userId) => {
  const res = await apiClient.patch(`/messages/conversation/${userId}/read`);
  return res.data;
};

export const deleteMessage = async (messageId) => {
  const res = await apiClient.delete(`/messages/${messageId}`);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await apiClient.get("/messages/unread-count");
  return res.data;
};
