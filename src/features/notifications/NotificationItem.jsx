import { Link } from "react-router-dom";
import resolveImageUrl from "../../utils/resolveImageUrl";

function formatRelative(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function renderContent(notification) {
  const actor = notification.actor;
  const actorName = actor?.username ? `@${actor.username}` : "Someone";
  const data = notification.data ?? {};
  const postTitle = data.postTitle || "your post";

  switch (notification.type) {
    case "post_vote": {
      const direction = Number(data.value) === -1 ? "downvoted" : "upvoted";
      return {
        title: `${actorName} ${direction} your post`,
        body: postTitle,
        to: data.postId ? `/post/${data.postId}` : null,
      };
    }
    case "comment": {
      return {
        title: `${actorName} commented on ${postTitle}`,
        body: data.commentSnippet || "",
        to: data.postId ? `/post/${data.postId}` : null,
      };
    }
    case "comment_reply": {
      return {
        title: `${actorName} replied to your comment`,
        body: data.commentSnippet || data.parentCommentSnippet || "",
        to: data.postId ? `/post/${data.postId}` : null,
      };
    }
    case "comment_vote": {
      const direction = Number(data.value) === -1 ? "downvoted" : "upvoted";
      return {
        title: `${actorName} ${direction} your comment`,
        body: data.commentSnippet || postTitle,
        to: data.postId ? `/post/${data.postId}` : null,
      };
    }
    case "community_post": {
      const community = data.communityName || data.communitySlug;
      return {
        title: `${actorName} posted in r/${community ?? "a community"}`,
        body: postTitle,
        to: data.postId ? `/post/${data.postId}` : null,
      };
    }
    case "direct_message": {
      const senderUsername = data.senderUsername || actorName;
      const snippet = data.messageSnippet || "";
      return {
        title: `${senderUsername} sent you a message`,
        body: snippet,
        to: data.senderId ? `/messages/${data.senderId}` : null,
      };
    }
    default:
      return {
        title: notification.title || `${actorName} sent a notification`,
        body: notification.body || "",
        to: null,
      };
  }
}

export default function NotificationItem({ notification }) {
  const { title, body, to } = renderContent(notification);
  const actor = notification.actor;
  const avatarSrc =
    resolveImageUrl(actor?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${actor?.username || "user"}`;

  const card = (
    <article
      className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg shadow-black/15 transition duration-300 ${
        notification.isRead
          ? "border-slate-700/70 bg-slate-900/50"
          : "border-blue-400/35 bg-slate-900/70"
      }`}
    >
      <img
        src={avatarSrc}
        alt={actor?.username || "User"}
        className="h-9 w-9 shrink-0 rounded-full border border-slate-700/70 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <span className="shrink-0 text-xs text-slate-500">
            {formatRelative(notification.createdAt)}
          </span>
        </div>
        {body ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {body}
          </p>
        ) : null}
      </div>
      {!notification.isRead ? (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400" aria-hidden />
      ) : null}
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
