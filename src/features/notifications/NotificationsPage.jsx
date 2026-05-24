import NotificationItem from "./NotificationItem";
import { useNotificationsQuery } from "./useNotificationsQuery";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import SimpleList from "../../ui/SimpleList";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import PageShell from "../../ui/PageShell";

export default function NotificationsPage() {
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useNotificationsQuery();

  if (isLoading) {
    return (
      <AsyncStateNotice
        message="Loading notifications..."
        maxWidth="max-w-3xl"
      />
    );
  }

  if (isError) {
    return (
      <AsyncStateNotice
        message="Failed to load notifications."
        tone="error"
        maxWidth="max-w-3xl"
      />
    );
  }

  return (
    <PageShell maxWidth="max-w-3xl">
      <PageHeaderBlock
        title="Notifications"
        description="Live updates from your communities, posts, and comments."
      />

      <SimpleList
        items={notifications}
        className="space-y-3"
        getKey={(notification) => notification._id ?? notification.id}
        renderItem={(notification) => (
          <NotificationItem notification={notification} />
        )}
      />
    </PageShell>
  );
}
