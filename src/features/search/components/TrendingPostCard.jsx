import { Link } from "react-router-dom";

function TrendingPostCard({ post }) {
  const voteTotal = Number(post.voteCount ?? post.votes ?? 0);

  return (
    <Link
      to={`/post/${post.id}`}
      className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/80 sm:p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {post.communityName}
      </p>
      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-100 transition-colors duration-300 group-hover:text-white">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">
        {post.content}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 sm:mt-4">
        <span>{Number.isFinite(voteTotal) ? voteTotal : 0} votes</span>
        <span>•</span>
        <span>{post.commentsCount ?? post.commentCount ?? 0} comments</span>
      </div>
    </Link>
  );
}

export default TrendingPostCard;
