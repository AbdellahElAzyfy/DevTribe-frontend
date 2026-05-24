import { useState } from "react";
import { useCreateComment } from "../../../hooks/useCommentQueries";
import { useCurrentUser } from "../../../hooks/useAuthQueries";

export default function CommentInput({ postId }) {
  const [content, setContent] = useState("");
  const { data: currentUser } = useCurrentUser();
  const createCommentMutation = useCreateComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { 
        postId, 
        data: { content: content.trim() } 
      },
      {
        onSuccess: () => {
          setContent("");
        },
      }
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
          placeholder="Add a comment..."
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none leading-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!content.trim() || createCommentMutation.isPending}
        className="flex h-[32px] items-center justify-center rounded-full bg-blue-600 px-5 text-[13px] font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
      >
        {createCommentMutation.isPending ? "..." : "Post"}
      </button>
    </form>
  );
}
