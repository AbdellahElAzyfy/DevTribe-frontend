import { queryKeys } from "../../lib/queryKeys";

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.notifications)) return value.notifications;
  return [];
}

export function register(socket, { queryClient }) {
  const onCreated = (notification) => {
    queryClient.setQueriesData({ queryKey: queryKeys.notifications.lists() }, (prev) => {
      const list = asArray(prev);
      if (list.some((n) => String(n._id ?? n.id) === String(notification._id ?? notification.id))) {
        return list;
      }
      return [notification, ...list];
    });
  };

  const onUpdated = (notification) => {
    const targetId = String(notification._id ?? notification.id);
    queryClient.setQueriesData({ queryKey: queryKeys.notifications.lists() }, (prev) => {
      const list = asArray(prev);
      return list.map((n) =>
        String(n._id ?? n.id) === targetId ? { ...n, ...notification } : n,
      );
    });
  };

  const onAllRead = () => {
    queryClient.setQueriesData({ queryKey: queryKeys.notifications.lists() }, (prev) => {
      const list = asArray(prev);
      return list.map((n) => ({ ...n, isRead: true }));
    });
  };

  socket.on("notification:created", onCreated);
  socket.on("notification:updated", onUpdated);
  socket.on("notification:all_read", onAllRead);

  return () => {
    socket.off("notification:created", onCreated);
    socket.off("notification:updated", onUpdated);
    socket.off("notification:all_read", onAllRead);
  };
}
