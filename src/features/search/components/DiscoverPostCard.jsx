import { Link } from "react-router-dom";

function DiscoverPostCard({ post }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="group rounded-xl border border-slate-700/60 bg-slate-900/55 p-3.5 transition duration-300 hover:border-slate-500/70 hover:bg-slate-900/75 sm:p-4"
    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{post.communityName}</span>
        <span>•</span>
        <span>{post.createdAt}</span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-100 transition-colors duration-300 group-hover:text-white sm:text-base">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-300">{post.content}</p>
    </Link>
  );
}

export default DiscoverPostCard;
