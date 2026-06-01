import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import apiClient from "../../services/apiClient";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch("/notifications/read-all");
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.lists() },
        (prev) => {
          if (Array.isArray(prev)) {
            return prev.map((n) => (n.isRead ? n : { ...n, isRead: true }));
          }
          if (Array.isArray(prev?.notifications)) {
            return {
              ...prev,
              notifications: prev.notifications.map((n) =>
                n.isRead ? n : { ...n, isRead: true }
              ),
            };
          }
          return prev;
        }
      );
    },
  });
}
