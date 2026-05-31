import { useParams, useNavigate } from "react-router-dom";
import { useConversations } from "../../../hooks/useMessageQueries";
import ConversationItem from "./ConversationItem";
import AsyncStateNotice from "../../../ui/AsyncStateNotice";
import EmptyStateCard from "../../../ui/EmptyStateCard";

export default function ConversationList() {
  const { data, isLoading, error } = useConversations();
  const { userId: selectedUserId } = useParams();

  if (isLoading) {
    return <AsyncStateNotice state="loading" message="Loading conversations..." />;
  }

  if (error) {
    return <AsyncStateNotice state="error" message={error.message || "Failed to load conversations"} />;
  }

  if (!data?.conversations?.length) {
    return <EmptyStateCard title="No conversations yet" description="Start a conversation by visiting a user's profile" />;
  }

  return (
    <div className="h-full overflow-y-auto space-y-3">
      {data.conversations.map((conv) => (
        <ConversationItem
          key={conv.user._id}
          conversation={conv}
          isActive={selectedUserId === conv.user._id}
        />
      ))}
    </div>
  );
}
