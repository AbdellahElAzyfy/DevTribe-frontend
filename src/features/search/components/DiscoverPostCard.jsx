import { Link } from "react-router-dom";
import { FaArrowUp, FaRegCommentDots } from "react-icons/fa6";
import { formatTimeAgo } from "../../../utils/formatUtils";

function DiscoverPostCard({ post }) {
  const voteCount = Number(post.voteCount ?? 0);
  const commentCount = Number(post.commentCount ?? 0);
  const communitySlug = post.community?.slug;
  const authorUsername = post.author?.username;

  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-900/55 p-3.5 transition duration-300 hover:border-slate-500/70 hover:bg-slate-900/80 sm:p-4"
    >
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        {communitySlug ? (
          <span className="font-semibold text-slate-300">r/{communitySlug}</span>
        ) : null}
        {communitySlug && authorUsername ? (
          <span className="text-slate-600">•</span>
        ) : null}
        {authorUsername ? <span>@{authorUsername}</span> : null}
        <span className="ml-auto text-slate-500">
          {formatTimeAgo(post.createdAt)}
        </span>
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100 transition-colors duration-300 group-hover:text-white sm:text-[15px]">
        {post.title}
      </h3>

      <p className="line-clamp-2 text-[12.5px] leading-relaxed text-slate-400">
        {post.content}
      </p>

      <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <FaArrowUp className="h-3 w-3 text-blue-400" />
          {voteCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FaRegCommentDots className="h-3 w-3" />
          {commentCount}
        </span>
      </div>
    </Link>
  );
}

export default DiscoverPostCard;
