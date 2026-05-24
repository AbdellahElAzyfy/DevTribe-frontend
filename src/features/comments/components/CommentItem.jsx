import { formatTimeAgo, formatUsername } from "../../../utils/formatUtils";
import resolveImageUrl from "../../../utils/resolveImageUrl";

export default function CommentItem({ comment }) {
  const displayUsername = formatUsername(comment.author?.username || "anonymous");
  const timeAgo = formatTimeAgo(comment.createdAt);
  
  const authorAvatar = resolveImageUrl(comment.author?.avatar) || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || "default"}`;

  return (
    <article className="group flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
      <img
        src={authorAvatar}
        alt={displayUsername}
        className="h-8 w-8 shrink-0 rounded-full border border-slate-700/50 object-cover shadow-sm"
      />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-slate-800/30 border border-slate-700/40 px-4 py-2.5 transition-all duration-200 group-hover:bg-slate-800/50 group-hover:border-slate-600/50">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] font-semibold text-slate-200">
              {displayUsername}
            </p>
            <span className="shrink-0 text-[10px] font-medium text-slate-500 uppercase tracking-tight">
              {timeAgo}
            </span>
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-slate-300 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </article>
  );
}
