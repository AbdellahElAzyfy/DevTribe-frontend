export default function CommentItem({ comment }) {
  const initial = comment?.author?.charAt(0)?.toUpperCase() || "?";

  return (
    <article className="flex items-start gap-3">
      {comment.avatar ? (
        <img
          src={comment.avatar}
          alt={comment.author || "Comment author"}
          className="h-9 w-9 shrink-0 rounded-full border border-slate-700/70 object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700/70 bg-slate-800/70 text-sm font-semibold text-slate-300">
          {initial}
        </div>
      )}

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/50 px-4 py-3">
        <p className="truncate text-sm font-medium text-slate-200">
          {comment.author}
        </p>
        <p className="truncate text-xs text-slate-500">
          {comment.handle} • {comment.createdAt}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {comment.body}
        </p>
      </div>
    </article>
  );
}
