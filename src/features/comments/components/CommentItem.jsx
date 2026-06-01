import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowUp,
  FaPen,
  FaReply,
  FaTrash,
} from "react-icons/fa6";
import { formatTimeAgo, formatUsername } from "../../../utils/formatUtils";
import resolveImageUrl from "../../../utils/resolveImageUrl";
import {
  useDeleteComment,
  useUpdateComment,
  useVoteComment,
} from "../../../hooks/useCommentQueries";
import { useAuth } from "../../../hooks/useAuth";
import ConfirmDialog from "../../../ui/ConfirmDialog";
import CommentInput from "./CommentInput";

const MAX_NESTING_DEPTH = 4;
const MAX_COMMENT_LENGTH = 3000;

export default function CommentItem({ comment, postId, depth = 0 }) {
  const [isReplying, setIsReplying] = useState(false);
  const [areRepliesOpen, setAreRepliesOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content ?? "");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { isAuthenticated, user: currentUser } = useAuth();
  const voteCommentMutation = useVoteComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment({
    onSuccess: () => setIsDeleteOpen(false),
  });

  const canManage =
    Boolean(currentUser?.username) &&
    currentUser.username === comment.author?.username;

  const displayUsername = formatUsername(
    comment.author?.username || "anonymous",
  );
  const timeAgo = formatTimeAgo(comment.createdAt);

  const authorAvatar =
    resolveImageUrl(comment.author?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || "default"}`;

  const userVote = Number(comment.userVote ?? 0);
  const voteCount = Number(comment.voteCount ?? 0);
  const isUpvoted = userVote === 1;
  const isDownvoted = userVote === -1;

  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  const canNest = depth < MAX_NESTING_DEPTH;

  const isVoteDisabled = !isAuthenticated || voteCommentMutation.isPending;

  const handleVote = (value) => {
    if (isVoteDisabled) return;
    voteCommentMutation.mutate({ postId, commentId: comment.id, value });
  };

  const startEditing = () => {
    setEditValue(comment.content ?? "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed.length > MAX_COMMENT_LENGTH) return;
    if (trimmed === comment.content) {
      setIsEditing(false);
      return;
    }
    if (updateCommentMutation.isPending) return;

    updateCommentMutation.mutate(
      { commentId: comment.id, data: { content: trimmed } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <article className="group animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-start gap-3">
        <img
          src={authorAvatar}
          alt={displayUsername}
          className="h-8 w-8 shrink-0 rounded-full border border-slate-700/50 object-cover shadow-sm"
        />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-slate-800/30 border border-slate-700/40 px-4 py-2.5 transition-all duration-200 group-hover:bg-slate-800/50 group-hover:border-slate-600/50">
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/profile/${comment.author?.username}`}
                className="truncate text-[13px] font-semibold text-slate-200 hover:text-blue-400 transition"
              >
                {displayUsername}
              </Link>
              <span className="shrink-0 text-[10px] font-medium text-slate-500 uppercase tracking-tight">
                {timeAgo}
              </span>
            </div>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                  maxLength={MAX_COMMENT_LENGTH}
                  autoFocus
                  className="w-full resize-none rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-[13.5px] leading-relaxed text-slate-200 outline-none transition focus:border-blue-400/60"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsEditing(false);
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSaveEdit();
                    }
                  }}
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={
                      !editValue.trim() || updateCommentMutation.isPending
                    }
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-[12px] font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateCommentMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-slate-400 transition hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-[13.5px] leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 pl-1 text-[11px] text-slate-400">
            <div className="inline-flex items-stretch overflow-hidden rounded-full border border-slate-700/60 bg-slate-950/50">
              <button
                type="button"
                onClick={() => handleVote(1)}
                aria-label="Upvote comment"
                disabled={isVoteDisabled}
                className={`inline-flex items-center justify-center px-2 py-1 transition-colors ${
                  isUpvoted
                    ? "bg-blue-600/25 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-blue-300"
                } ${isVoteDisabled ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <FaArrowUp className="h-3 w-3" />
              </button>
              <div
                className={`flex min-w-7 items-center justify-center border-x border-slate-700/60 px-1.5 text-[11px] font-bold ${
                  isUpvoted
                    ? "text-blue-400"
                    : isDownvoted
                      ? "text-rose-400"
                      : "text-slate-300"
                }`}
              >
                {voteCount}
              </div>
              <button
                type="button"
                onClick={() => handleVote(-1)}
                aria-label="Downvote comment"
                disabled={isVoteDisabled}
                className={`inline-flex items-center justify-center px-2 py-1 transition-colors ${
                  isDownvoted
                    ? "bg-rose-500/20 text-rose-400"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-rose-300"
                } ${isVoteDisabled ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <FaArrowDown className="h-3 w-3" />
              </button>
            </div>

            {isAuthenticated && canNest && (
              <button
                type="button"
                onClick={() => setIsReplying((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
              >
                <FaReply className="h-3 w-3" />
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}

            {canManage && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
                >
                  <FaPen className="h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
                </button>
              </>
            )}

            {hasReplies && (
              <button
                type="button"
                onClick={() => setAreRepliesOpen((prev) => !prev)}
                className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
              >
                {areRepliesOpen ? "Hide" : "Show"} {replies.length}{" "}
                {replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentInput
                postId={postId}
                parentCommentId={comment.id}
                placeholder={`Reply to ${displayUsername}...`}
                autoFocus
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {hasReplies && areRepliesOpen && (
            <div className="mt-4 space-y-3 border-l-2 border-slate-700/40 pl-2 sm:pl-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete comment"
        description={
          hasReplies
            ? "This will delete your comment and its replies. This action cannot be undone."
            : "This will permanently delete your comment. This action cannot be undone."
        }
        confirmLabel="Delete comment"
        isLoading={deleteCommentMutation.isPending}
        onConfirm={() =>
          deleteCommentMutation.mutate({ postId, commentId: comment.id })
        }
        onClose={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}
