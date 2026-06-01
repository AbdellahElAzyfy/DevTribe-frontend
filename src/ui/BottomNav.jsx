import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiOutlinePlus,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { MdExplore } from "react-icons/md";
import { useUnreadCount } from "../hooks/useMessageQueries";
import { useProfileQuery } from "../features/users/useProfileQuery";
import resolveImageUrl from "../utils/resolveImageUrl";

const tabClass = ({ isActive }) =>
  `relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ${
    isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
  }`;

/**
 * Mobile-only bottom tab bar (Instagram/Facebook style).
 *
 * Hidden from `md:` up — desktop/tablet keep the sidebar + header navigation.
 * Rendered by AppLayout, so it only appears on authenticated routes.
 */
export default function BottomNav() {
  const { data: unreadData } = useUnreadCount();
  const { data: profile } = useProfileQuery();

  const unreadCount = unreadData?.count ?? 0;
  const avatarSrc =
    resolveImageUrl(profile?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "user"}`;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 flex h-16 items-stretch gap-1 rounded-4xl border border-white/10 bg-slate-900/45 px-2 shadow-2xl shadow-black/50 ring-1 ring-white/5 backdrop-blur-2xl md:hidden"
    >
      <NavLink to="/home" className={tabClass}>
        <HiHome className="h-5 w-5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/explore" className={tabClass}>
        <MdExplore className="h-5 w-5" />
        <span>Explore</span>
      </NavLink>

      {/* Create — elevated primary action */}
      <NavLink
        to="/create-post"
        aria-label="Create Post"
        className="flex flex-1 items-center justify-center"
      >
        {({ isActive }) => (
          <span
            className={`inline-flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full border-2 shadow-lg shadow-blue-900/40 transition-all duration-200 ${
              isActive
                ? "border-blue-300/70 bg-blue-500 text-white"
                : "border-blue-400/40 bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <HiOutlinePlus className="h-6 w-6" />
          </span>
        )}
      </NavLink>

      <NavLink to="/messages" className={tabClass}>
        <span className="relative">
          <HiChatBubbleLeftRight className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1.5 -right-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </span>
        <span>Messages</span>
      </NavLink>

      <NavLink to="/profile" end className={tabClass}>
        {({ isActive }) => (
          <>
            <img
              src={avatarSrc}
              alt=""
              className={`h-6 w-6 rounded-full object-cover ring-1 ${
                isActive ? "ring-blue-400" : "ring-slate-600"
              }`}
            />
            <span>Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
