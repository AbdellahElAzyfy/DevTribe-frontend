import { Link } from "react-router-dom";
import { FaArrowUp, FaRegCommentDots } from "react-icons/fa6";
import resolveImageUrl from "../../../utils/resolveImageUrl";
import { formatTimeAgo } from "../../../utils/formatUtils";

function TrendingPostCard({ post, rank }) {
  const voteCount = Number(post.voteCount ?? 0);
  const commentCount = Number(post.commentCount ?? 0);
  const communityName = post.community?.name ?? post.communityName ?? "";
  const communitySlug = post.community?.slug;
  const safeImageUrl = resolveImageUrl(post.image || post.imageUrl);
  const authorUsername = post.author?.username;

  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/60 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/80"
    >
      <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-slate-800/60 bg-slate-950/40 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          #
        </span>
        <span className="text-xl font-extrabold text-slate-200">{rank}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          {communitySlug ? (
            <span className="rounded-full bg-slate-800/70 px-2 py-0.5 text-slate-300">
              r/{communitySlug}
            </span>
          ) : communityName ? (
            <span>{communityName}</span>
          ) : null}
          {authorUsername ? (
            <>
              <span className="text-slate-600">•</span>
              <span className="truncate text-slate-500">@{authorUsername}</span>
            </>
          ) : null}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-100 transition-colors duration-300 group-hover:text-white sm:text-base">
          {post.title}
        </h3>

        {safeImageUrl ? (
          <div className="overflow-hidden rounded-lg border border-slate-800/60 bg-slate-950/40">
            <img
              src={safeImageUrl}
              alt=""
              loading="lazy"
              className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-400">
            {post.content}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 text-[11px] font-semibold text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <FaArrowUp className="h-3 w-3 text-blue-400" />
            {voteCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaRegCommentDots className="h-3 w-3" />
            {commentCount}
          </span>
          <span className="ml-auto text-slate-500">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default TrendingPostCard;
