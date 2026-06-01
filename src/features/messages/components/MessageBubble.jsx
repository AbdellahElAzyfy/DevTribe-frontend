import { useAuth } from "../../../hooks/useAuth";

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

export default function MessageBubble({ message }) {
  const { user } = useAuth();
  const isSender =
    message.sender._id === user?.id || message.sender === user?.id;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-md ${
          isSender
            ? "bg-blue-500 text-white"
            : "border border-slate-700/60 bg-slate-800/70 text-slate-100"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <div
          className={`mt-1 flex items-center gap-2 text-xs ${
            isSender ? "text-blue-100" : "text-slate-500"
          }`}
        >
          <span>{formatRelative(message.createdAt)}</span>
          {isSender && message.isRead && <span>· Read</span>}
        </div>
      </div>
    </div>
  );
}
