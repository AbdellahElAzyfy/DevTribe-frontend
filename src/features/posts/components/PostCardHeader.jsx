import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";
import {
  formatTimeAgo,
  calculateReadTime,
  formatCommunityName,
  formatUsername,
} from "../../../utils/formatUtils";
import resolveImageUrl from "../../../utils/resolveImageUrl";

function PostCardHeader({
  user,
  communityName,
  communitySlug,
  createdAt,
  readTime,
  isEdited,
  content,
  canManage = false,
  onEdit,
  onDelete,
}) {
  const displayUsername = formatUsername(user?.username || "anonymous");
  const displayCommunity = formatCommunityName(communityName);
  const timeAgo = formatTimeAgo(createdAt);
  const estimatedReadTime = readTime || calculateReadTime(content);
  const role = user?.role || "member";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handlePointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  return (
    <div className="mb-4 flex items-center gap-3">
      {/* User Avatar */}
      <Link to={`/profile/${user?.username}`} className="relative h-10 w-10 shrink-0">
        <img
          src={resolveImageUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "anon"}`}
          alt={displayUsername}
          className="h-full w-full rounded-full border border-slate-700/80 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-sm" title="Online" />
      </Link>

      {/* Identity & Metadata */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center flex-wrap gap-2">
          <Link 
            to={`/profile/${user?.username}`}
            className="text-[14px] font-bold tracking-tight text-slate-100 transition-colors hover:text-blue-400 cursor-pointer"
          >
            {displayUsername}
          </Link>
          
          {/* Role Badge */}
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest border transition-colors ${
            role === 'admin' 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
              : role === 'moderator'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700/70 text-slate-500'
          }`}>
            {role}
          </span>

          {isEdited && (
            <span className="text-[10px] font-medium italic text-slate-600">
              (edited)
            </span>
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-500">
          <Link 
            to={`/community/${communitySlug}`}
            className="text-blue-400/90 hover:text-blue-300 cursor-pointer transition-colors"
          >
            {displayCommunity}
          </Link>
          <span className="text-slate-700">•</span>
          <span className="hover:text-slate-400 transition-colors">{timeAgo}</span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {estimatedReadTime}
          </span>
        </div>
      </div>

      {/* Author actions */}
      {canManage && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Post options"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-slate-200"
          >
            <FaEllipsis className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/95 shadow-xl shadow-black/40"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit?.();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800/80"
              >
                <FaPen className="h-3.5 w-3.5 text-slate-400" />
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete?.();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
              >
                <FaTrash className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCardHeader;
