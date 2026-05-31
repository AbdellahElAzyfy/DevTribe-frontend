import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import * as apiMessages from "../services/apiMessages";

export const useConversations = ({ page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => apiMessages.getConversations({ page, limit }),
  });
};

export const useConversation = (userId, { page = 1, limit = 50 } = {}) => {
  return useQuery({
    queryKey: queryKeys.messages.conversation(userId),
    queryFn: () => apiMessages.getConversation(userId, { page, limit }),
    enabled: !!userId,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.messages.unreadCount(),
    queryFn: apiMessages.getUnreadCount,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMessages.createMessage,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversation(variables.recipientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
    },
  });
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMessages.markConversationRead,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversation(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMessages.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all() });
    },
  });
};
