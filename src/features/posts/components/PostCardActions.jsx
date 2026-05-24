import {
  FaArrowDown,
  FaArrowUp,
  FaBookmark,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegShareFromSquare,
} from "react-icons/fa6";

function PostCardActions({
  fakeVotes,
  userVote,
  onUpvote,
  onDownvote,
  canDownvote,
  isVoting,
  commentsCount,
  onToggleComments,
  isSaved,
  isTogglingSavedState,
  onToggleSaved,
}) {
  const isUpvoted = userVote === 1;
  const isDownvoted = userVote === -1;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-700/50 pt-3 text-xs text-slate-400 sm:text-sm">
      <div className="inline-flex items-stretch overflow-hidden rounded-full border border-slate-700/70 bg-slate-950/60 shadow-sm shadow-black/20">
        <button
          type="button"
          onClick={onUpvote}
          aria-label="Upvote"
          disabled={isVoting}
          className={`inline-flex items-center justify-center px-3 py-2 transition-all duration-300 ${
            isUpvoted
              ? "bg-linear-to-br from-blue-600/30 to-indigo-500/20 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-blue-300"
          } ${isVoting ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <FaArrowUp className={`h-4 w-4 ${isUpvoted ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" : ""}`} />
        </button>

        <div className={`flex min-w-10 items-center justify-center border-x border-slate-700/70 px-2 text-[11px] font-bold transition-colors duration-300 ${
          isUpvoted ? "text-blue-400" : isDownvoted ? "text-rose-400" : "text-slate-200"
        }`}>
          {fakeVotes}
        </div>

        <button
          type="button"
          onClick={onDownvote}
          aria-label="Downvote"
          disabled={isVoting || (!isDownvoted && !canDownvote)}
          className={`inline-flex items-center justify-center px-3 py-2 transition-all duration-300 ${
            isDownvoted
              ? "bg-rose-500/20 text-rose-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-rose-300"
          } ${isVoting || (!isDownvoted && !canDownvote) ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <FaArrowDown className={`h-4 w-4 ${isDownvoted ? "drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]" : ""}`} />
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleComments}
        aria-label="Comments"
        className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/55 px-3 py-2 text-slate-300 transition-all duration-300 ease-out hover:border-slate-600 hover:bg-slate-900/80 hover:text-white"
      >
        <FaRegCommentDots className="h-4 w-4" />
        <span className="text-[11px] font-semibold text-slate-200">
          {commentsCount}
        </span>
      </button>

      <button
        type="button"
        aria-label="Share"
        className="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/55 p-2.5 text-slate-300 transition-all duration-300 ease-out hover:border-slate-600 hover:bg-slate-900/80 hover:text-white"
      >
        <FaRegShareFromSquare className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onToggleSaved}
        aria-label={isSaved ? "Saved" : "Save"}
        aria-pressed={isSaved}
        disabled={isTogglingSavedState}
        className={`inline-flex items-center justify-center rounded-full border p-2.5 transition-all duration-300 ease-out ${
          isSaved
            ? "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
            : "border-slate-700/70 bg-slate-950/55 text-slate-400 hover:border-slate-600 hover:bg-slate-900/80 hover:text-slate-200"
        } ${isTogglingSavedState ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {isSaved ? (
          <FaBookmark className="h-4 w-4 animate-in fade-in zoom-in duration-300" />
        ) : (
          <FaRegBookmark className="h-4 w-4 transition-transform duration-300 active:scale-90" />
        )}
      </button>
    </div>
  );
}

export default PostCardActions;
