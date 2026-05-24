import { useState } from "react";
import { FaTrash, FaArrowRight, FaClock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useToggleSavedPostMutation } from "../posts/usePostQueries";
import resolveImageUrl from "../../utils/resolveImageUrl";

export default function SavedPostCard({ post, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const toggleSavedPostMutation = useToggleSavedPostMutation();

  const {
    id,
    title,
    content,
    imageUrl,
    image,
    author: user,
    community,
    readTime,
  } = post;

  const safeImageUrl = resolveImageUrl(imageUrl || image);
  const communityName = community?.name || "Community";
  const communitySlug = community?.slug;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    
    toggleSavedPostMutation.mutate(id, {
      onSuccess: () => {
        onRemove?.(id);
      },
      onSettled: () => {
        setIsRemoving(false);
      }
    });
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 transition-all duration-500 hover:border-blue-500/40 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-500/10 ${
        isRemoving ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Top Section: Image Preview or Color Gradient */}
      <div className="relative h-32 w-full overflow-hidden sm:h-40">
        {safeImageUrl ? (
          <img
            src={safeImageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        {/* Community Badge */}
        <div className="absolute top-3 left-3">
          <Link
            to={`/community/${communitySlug}`}
            className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-blue-400 uppercase backdrop-blur-md transition-colors hover:bg-blue-500/20"
          >
            {communityName}
          </Link>
        </div>

        {/* Unsave Button (Top Right) */}
        <button
          onClick={handleRemove}
          disabled={toggleSavedPostMutation.isPending}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 text-slate-400 backdrop-blur-sm transition-all hover:bg-rose-500/90 hover:text-white"
          title="Remove from saved"
        >
          <FaTrash className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "user"}`}
              className="h-5 w-5 rounded-full border border-slate-700"
              alt={user?.username}
            />
            <span className="text-xs font-medium text-slate-400">
              @{user?.username}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <FaClock className="h-3 w-3" />
            {readTime || "3 min read"}
          </div>
        </div>

        <Link to={`/post/${id}`} className="block flex-1 group/title">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-100 transition-colors group-hover/title:text-blue-400">
            {title}
          </h3>
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
            {content}
          </p>
        </Link>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-800/60">
          <Link
            to={`/post/${id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800/50 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-blue-600 hover:text-white"
          >
            View Discussion
            <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
