import { useState } from "react";
import { useCreateComment } from "../../../hooks/useCommentQueries";

export default function CommentInput({
  postId,
  parentCommentId = null,
  placeholder = "Add a comment...",
  autoFocus = false,
  onSuccess,
  onCancel,
}) {
  const [content, setContent] = useState("");
  const createCommentMutation = useCreateComment();

  const isReply = Boolean(parentCommentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        postId,
        data: parentCommentId
          ? { content: trimmed, parentCommentId }
          : { content: trimmed },
      },
      {
        onSuccess: (data, variables, context) => {
          setContent("");
          onSuccess?.(data, variables, context);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-full border border-slate-700/50 bg-slate-900/40 p-1.5 pl-5 focus-within:border-blue-500/50 transition-all animate-in fade-in slide-in-from-top-2 duration-300 h-[44px]"
    >
      <div className="flex-1 flex items-center h-full">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none leading-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
            if (e.key === "Escape" && isReply) {
              onCancel?.();
            }
          }}
        />
      </div>

      {isReply && (
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[32px] items-center justify-center rounded-full px-3 text-[12px] font-semibold text-slate-400 transition-colors hover:text-slate-200"
        >
          Cancel
        </button>
      )}

      <button
        type="submit"
        disabled={!content.trim() || createCommentMutation.isPending}
        className="flex h-[32px] items-center justify-center rounded-full bg-blue-600 px-5 text-[13px] font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
      >
        {createCommentMutation.isPending ? "..." : isReply ? "Reply" : "Post"}
      </button>
    </form>
  );
}
