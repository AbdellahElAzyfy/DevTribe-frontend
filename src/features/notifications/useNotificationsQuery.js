import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import apiClient from "../../services/apiClient";

function normalize(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
}

export function useNotificationsQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.list({}),
    queryFn: async () => {
      try {
        const res = await apiClient.get("/notifications");
        console.log(res.data, res);
        return normalize(res.data);
      } catch (_err) {
        return [];
      }
    },
    enabled: options.enabled ?? true,
  });
}
