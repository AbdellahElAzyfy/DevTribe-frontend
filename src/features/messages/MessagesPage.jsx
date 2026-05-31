import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import EmptyStateCard from "../../ui/EmptyStateCard";

export default function MessagesPage() {
  const { userId } = useParams();

  return (
    <PageShell maxWidth="max-w-7xl">
      <PageHeaderBlock
        title="Messages"
        description="Direct messages with other members"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:h-[calc(100vh-16rem)]">
        <div className="lg:col-span-1 overflow-hidden">
          <ConversationList />
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-[600px]">
          {userId ? (
            <ChatWindow userId={userId} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyStateCard
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging"
              />
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
