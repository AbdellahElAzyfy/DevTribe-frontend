import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";

export default function MessagesPage() {
  const { userId } = useParams();

  // X-style single-pane navigation: the conversation list is the default view,
  // and selecting a conversation swaps the whole pane for the chat window
  // (which renders its own back button to return here).
  if (userId) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <div className="flex flex-col h-[calc(100vh-10rem)]">
          <ChatWindow userId={userId} />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-3xl">
      <PageHeaderBlock
        title="Messages"
        description="Direct messages with other members"
      />
      <ConversationList />
    </PageShell>
  );
}
