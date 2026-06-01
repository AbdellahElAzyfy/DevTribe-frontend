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
    // Fill the main content area exactly. The layout's <main> already supplies
    // matching top/bottom padding, so we only subtract the header (4rem) + that
    // padding: 3rem on desktop, and the mobile bottom-nav allowance below md.
    return (
      <div className="mx-auto w-full max-w-3xl h-[calc(100dvh-12rem)] md:h-[calc(100vh-7rem)]">
        <ChatWindow userId={userId} />
      </div>
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
