import { queryKeys } from "../../lib/queryKeys";

export function register(socket, { queryClient, currentUserId }) {
  const handleMessageCreated = ({ message }) => {
    // Determine the other user in the conversation
    const senderId = String(message.sender._id ?? message.sender);
    const recipientId = String(message.recipient._id ?? message.recipient);
    const currentUserIdStr = String(currentUserId);

    // The conversation key is always the OTHER user's ID
    const otherUserId = currentUserIdStr === senderId ? recipientId : senderId;
    const conversationKey = queryKeys.messages.conversation(otherUserId);

    // Update the conversation cache
    queryClient.setQueryData(conversationKey, (prev) => {
      if (!prev?.messages) return prev;

      const messageId = String(message._id ?? message.id);
      // Check if message already exists
      if (prev.messages.some(m => String(m._id ?? m.id) === messageId)) {
        return prev;
      }

      // Append the new message
      return { ...prev, messages: [...prev.messages, message] };
    });

    // Invalidate conversations list and unread count
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
  };

  const handleMessageRead = ({ messageId, conversationUserId }) => {
    const conversationKey = queryKeys.messages.conversation(String(conversationUserId));

    queryClient.setQueryData(conversationKey, (prev) => {
      if (!prev?.messages) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m =>
          String(m._id ?? m.id) === String(messageId)
            ? { ...m, isRead: true, readAt: new Date().toISOString() }
            : m
        ),
      };
    });

    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
  };

  const handleConversationRead = ({ conversationUserId }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversation(String(conversationUserId)) });
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() });
  };

  const handleMessageDeleted = ({ messageId, conversationUserId }) => {
    const conversationKey = queryKeys.messages.conversation(String(conversationUserId));

    queryClient.setQueryData(conversationKey, (prev) => {
      if (!prev?.messages) return prev;
      return {
        ...prev,
        messages: prev.messages.filter(m => String(m._id ?? m.id) !== String(messageId)),
      };
    });

    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
  };

  socket.on("message:created", handleMessageCreated);
  socket.on("message:read", handleMessageRead);
  socket.on("message:conversation_read", handleConversationRead);
  socket.on("message:deleted", handleMessageDeleted);

  return () => {
    socket.off("message:created", handleMessageCreated);
    socket.off("message:read", handleMessageRead);
    socket.off("message:conversation_read", handleConversationRead);
    socket.off("message:deleted", handleMessageDeleted);
  };
}
