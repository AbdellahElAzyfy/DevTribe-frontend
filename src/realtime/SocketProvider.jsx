import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { getSocket } from "../services/socketClient";
import { register as registerNotifications } from "./handlers/notifications";
import { register as registerPosts } from "./handlers/posts";
import { register as registerComments } from "./handlers/comments";
import { register as registerMessages } from "./handlers/messages";

export default function SocketProvider({ children }) {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, accessToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const socket = getSocket();
    if (!socket) {
      return undefined;
    }

    const ctx = { queryClient, currentUserId: user?.id ?? user?._id };

    const unsubs = [
      registerNotifications(socket, ctx),
      registerPosts(socket, ctx),
      registerComments(socket, ctx),
      registerMessages(socket, ctx),
    ];

    return () => {
      unsubs.forEach((unsub) => {
        try {
          unsub?.();
        } catch {
          // ignore
        }
      });
    };
  }, [isAuthenticated, accessToken, queryClient, user?.id, user?._id]);

  return children;
}
