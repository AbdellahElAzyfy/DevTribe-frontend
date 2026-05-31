import { useNavigate } from "react-router-dom";
import resolveImageUrl from "../../../utils/resolveImageUrl";

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

export default function ConversationItem({ conversation, isActive }) {
  const { user, lastMessage, unreadCount } = conversation;
  const navigate = useNavigate();

  const avatarSrc =
    resolveImageUrl(user.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <article
      onClick={() => navigate(`/messages/${user._id}`)}
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-lg shadow-black/15 transition duration-300 ${
        isActive
          ? "border-blue-400/50 bg-slate-900/80"
          : "border-slate-700/60 bg-slate-900/50 hover:border-slate-600/70 hover:bg-slate-900/70"
      }`}
    >
      <div className="relative">
        <img
          src={avatarSrc}
          alt={user.username}
          className="h-12 w-12 shrink-0 rounded-full"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-100">
            @{user.username}
          </h3>
          <span className="shrink-0 text-xs text-slate-500">
            {formatRelative(lastMessage.createdAt)}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-slate-400">
          {lastMessage.content}
        </p>
      </div>
    </article>
  );
}
