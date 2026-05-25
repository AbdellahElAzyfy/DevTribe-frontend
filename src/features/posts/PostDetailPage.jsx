import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegMessage,
  FaPaperPlane,
  FaClock,
  FaHashtag,
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaRegBookmark
} from "react-icons/fa6";
import { usePostByIdQuery, useVotePostMutation, useToggleSavedPostMutation } from "./usePostQueries";
import { useListComments, useCreateComment } from "../../hooks/useCommentQueries";
import PostCardActions from "./components/PostCardActions";
import CommentItem from "../comments/components/CommentItem";
import buildCommentTree from "../comments/buildCommentTree";
import PageShell from "../../ui/PageShell";
import ContentRenderer from "../../ui/ContentRenderer";
import resolveImageUrl from "../../utils/resolveImageUrl";
import {
  formatTimeAgo,
  calculateReadTime,
} from "../../utils/formatUtils";
import { useProfileQuery } from "../users/useProfileQuery";

export default function PostDetailPage() {
  const { data: profile } = useProfileQuery();
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState("");
  
  const { data: post, isLoading, isError } = usePostByIdQuery(id);
  const { data: commentsResponse, isLoading: isLoadingComments } = useListComments(id);
  const createCommentMutation = useCreateComment();
  const votePostMutation = useVotePostMutation();
  const toggleSavedPostMutation = useToggleSavedPostMutation();

  const [fakeVotes, setFakeVotes] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(0);

  useEffect(() => {
    if (post) {
      setFakeVotes(post.voteCount ?? 0);
      setCurrentUserVote(post.userVote ?? 0);
    }
  }, [post]);

  const scrollToDiscussion = () => {
    const element = document.getElementById("discussion-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus the textarea after a short delay for the scroll to start
      setTimeout(() => {
        const textarea = document.getElementById("comment-textarea");
        if (textarea) textarea.focus();
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 rounded-lg bg-slate-800" />
          <div className="h-96 rounded-2xl bg-slate-800/50" />
          <div className="space-y-3">
            <div className="h-20 rounded-xl bg-slate-800/30" />
            <div className="h-20 rounded-xl bg-slate-800/30" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (isError || !post) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-900/40 p-12 text-center">
          <div className="mb-4 rounded-full bg-slate-800 p-4">
            <FaRegMessage className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Post not found</h2>
          <p className="mt-2 text-slate-400">The post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-500"
          >
            Go Back
          </button>
        </div>
      </PageShell>
    );
  }

  const handleVote = (value) => {
    if (votePostMutation.isPending) return;

    let delta = 0;
    let nextVote = 0;

    if (currentUserVote === value) {
      delta = -value;
      nextVote = 0;
    } else {
      delta = value - currentUserVote;
      nextVote = value;
    }

    const previousVotes = fakeVotes;
    const previousUserVote = currentUserVote;

    setFakeVotes((prev) => prev + delta);
    setCurrentUserVote(nextVote);

    votePostMutation.mutate(
      { postId: post.id, value },
      {
        onError: () => {
          setFakeVotes(previousVotes);
          setCurrentUserVote(previousUserVote);
        },
      }
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim() || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { postId: post.id, data: { content: commentContent } },
      {
        onSuccess: () => {
          setCommentContent("");
        },
      }
    );
  };

  const comments = commentsResponse?.comments || [];
  const commentTree = buildCommentTree(comments);
  const safeImageUrl = resolveImageUrl(post.imageUrl || post.image);
  
  const postAuthorAvatar = resolveImageUrl(post.author.avatar) || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`;

  const loggedInUserAvatar = resolveImageUrl(profile?.avatar) || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "default"}`;

  return (
    <PageShell maxWidth="max-w-4xl" padding="pb-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
      >
        <FaArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back to feed
      </button>

      <article className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-md">
        {/* Author Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/60 p-4 sm:p-6">
          <img
            src={postAuthorAvatar}
            alt={post.author.username}
            className="h-10 w-10 rounded-full border border-slate-700 shadow-inner"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">@{post.author.username}</span>
              <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {post.author.role || "MEMBER"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to={`/community/${post.community?.slug}`} className="font-semibold text-blue-400/80 hover:underline">
                r/{post.community?.name}
              </Link>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <FaClock className="h-3 w-3" />
                {post.readTime || calculateReadTime(post.content)}
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4 sm:p-8">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-invert max-w-none mb-8 text-slate-300 leading-relaxed">
            <ContentRenderer content={post.content} />
          </div>

          {post.tags?.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700/50">
                  <FaHashtag className="h-2.5 w-2.5 text-blue-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {safeImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/40">
              <img
                src={safeImageUrl}
                alt={post.title}
                className="w-full object-contain max-h-[600px]"
              />
            </div>
          )}

          {/* Actions */}
          <PostCardActions
            fakeVotes={fakeVotes}
            userVote={currentUserVote}
            onUpvote={() => handleVote(1)}
            onDownvote={() => handleVote(-1)}
            canDownvote={true}
            isVoting={votePostMutation.isPending}
            commentsCount={post.commentCount}
            onToggleComments={scrollToDiscussion}
            isSaved={post.isSaved}
            isTogglingSavedState={toggleSavedPostMutation.isPending}
            onToggleSaved={() => toggleSavedPostMutation.mutate(post.id)}
          />
        </div>
      </article>

      {/* Comment Section */}
      <div id="discussion-section" className="mt-10 space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-100">Discussion</h2>
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-400">
            {post.commentCount} comments
          </span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 rounded-full border border-slate-700/50 bg-slate-900/40 p-1.5 pl-5 focus-within:border-blue-500/50 transition-all h-[44px]">
          <div className="flex-1 flex items-center h-full">
            <input
              id="comment-textarea"
              type="text"
              placeholder="Add to the discussion..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none leading-none"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!commentContent.trim() || createCommentMutation.isPending}
            className="flex h-[32px] items-center justify-center rounded-full bg-blue-600 px-5 text-[13px] font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
          >
            {createCommentMutation.isPending ? "..." : "Post"}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <div className="space-y-4">
              <div className="h-32 rounded-2xl bg-slate-800/30 animate-pulse" />
              <div className="h-32 rounded-2xl bg-slate-800/30 animate-pulse" />
            </div>
          ) : commentTree.length > 0 ? (
            commentTree.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
              />
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium italic">No comments yet. Be the first to join the conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sticky Bottom Bar (Senior UX) */}
      <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-[95%] -translate-x-1/2 sm:max-w-2xl">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl ring-1 ring-white/5">
          {/* Vote Group */}
          <div className="flex items-center rounded-xl bg-slate-950/50 p-1 border border-slate-800/50">
            <button 
              onClick={() => handleVote(1)}
              className={`p-2 transition-colors ${currentUserVote === 1 ? "text-blue-400" : "text-slate-500 hover:text-blue-300"}`}
            >
              <FaArrowUp className="h-4 w-4" />
            </button>
            <span className={`px-2 text-xs font-bold ${currentUserVote === 1 ? "text-blue-400" : currentUserVote === -1 ? "text-rose-400" : "text-slate-200"}`}>
              {fakeVotes}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={`p-2 transition-colors ${currentUserVote === -1 ? "text-rose-400" : "text-slate-500 hover:text-rose-300"}`}
            >
              <FaArrowDown className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Comment Trigger */}
          <button 
            onClick={scrollToDiscussion}
            className="flex flex-1 items-center gap-3 rounded-xl bg-slate-800/50 px-4 py-2 text-sm text-slate-400 transition-all hover:bg-slate-700/50 hover:text-slate-200"
          >
            <FaRegMessage className="h-3.5 w-3.5" />
            Add a comment...
          </button>

          {/* Bookmark */}
          <button 
            onClick={() => toggleSavedPostMutation.mutate(post.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              post.isSaved 
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            {post.isSaved ? <FaBookmark className="h-4 w-4" /> : <FaRegBookmark className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
