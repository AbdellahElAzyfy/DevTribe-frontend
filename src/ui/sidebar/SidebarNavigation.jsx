import { FaBookmark, FaFireAlt } from "react-icons/fa";
import { HiHome, HiUserGroup, HiChatBubbleLeftRight } from "react-icons/hi2";
import { MdExplore } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useUnreadCount } from "../../hooks/useMessageQueries";

function SidebarNavigation({ onNavigate, navItemClass }) {
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="border-b border-slate-700/50 px-2 pb-3">
      <nav className="flex flex-col gap-1">
        <NavLink to="/home" className={navItemClass} onClick={onNavigate}>
          <HiHome className="h-5 w-5 shrink-0" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/popular" className={navItemClass} onClick={onNavigate}>
          <FaFireAlt className="h-5 w-5 shrink-0" />
          <span>Popular</span>
        </NavLink>

        <NavLink to="/explore" className={navItemClass} onClick={onNavigate}>
          <MdExplore className="h-5 w-5 shrink-0" />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/messages" className={navItemClass} onClick={onNavigate}>
          <HiChatBubbleLeftRight className="h-5 w-5 shrink-0" />
          <span>Messages</span>
          {unreadCount > 0 && (
            <span className="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink to="/saved" className={navItemClass} onClick={onNavigate}>
          <FaBookmark className="h-5 w-5 shrink-0" />
          <span>Saved</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default SidebarNavigation;
