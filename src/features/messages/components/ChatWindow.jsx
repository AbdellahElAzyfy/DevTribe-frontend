import { useState, useEffect, useRef } from "react";
import { useConversation, useSendMessage, useMarkConversationRead } from "../../../hooks/useMessageQueries";
import { useAuth } from "../../../hooks/useAuth";
import MessageBubble from "./MessageBubble";
import AsyncStateNotice from "../../../ui/AsyncStateNotice";

export default function ChatWindow({ userId }) {
  const { data, isLoading, error } = useConversation(userId);
  const sendMessage = useSendMessage();
  const markRead = useMarkConversationRead();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  useEffect(() => {
    if (userId && data?.messages) {
      const hasUnread = data.messages.some((m) => {
        const recipientId = m.recipient?._id ?? m.recipient;
        const currentUserId = user?.id ?? user?._id;
        return !m.isRead && String(recipientId) === String(currentUserId);
      });

      if (hasUnread) {
        markRead.mutate(userId);
      }
    }
  }, [userId, data?.messages, user?.id, user?._id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessage.mutate(
      { recipientId: userId, content },
      {
        onSuccess: () => setContent(""),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/50">
        <AsyncStateNotice state="loading" message="Loading messages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/50">
        <AsyncStateNotice state="error" message={error.message || "Failed to load conversation"} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-700/60 bg-slate-900/50 shadow-lg shadow-black/15">
      <div className="border-b border-slate-700/60 p-4">
        <h2 className="text-lg font-semibold text-slate-100">
          @{data?.otherUser?.username}
        </h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {data?.messages?.map((msg) => (
          <MessageBubble key={msg._id ?? msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-700/60 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-400/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || sendMessage.isPending}
            className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
