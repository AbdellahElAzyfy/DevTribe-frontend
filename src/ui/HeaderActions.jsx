import { HiOutlineBell } from "react-icons/hi";
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import { useMemo, useState } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useNotificationsQuery } from "../features/notifications/useNotificationsQuery";
import { useProfileQuery } from "../features/users/useProfileQuery";
import { useAuth } from "../hooks/useAuth";
import resolveImageUrl from "../utils/resolveImageUrl";

export default function HeaderActions() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: notifications = [] } = useNotificationsQuery({
    enabled: isAuthenticated,
  });
  const { data: profile } = useProfileQuery({
    enabled: isAuthenticated,
  });

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const unreadLabel =
    unreadNotificationsCount > 99 ? "99+" : String(unreadNotificationsCount);

  const avatarSrc =
    resolveImageUrl(profile?.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "user"}`;
  const avatarAlt = profile?.username || "Profile";

  return (
    <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
      {!isAuthenticated ? (
        <>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/login"
              aria-label="Login"
              className="dash-frame inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(59,130,246,0.64)] bg-slate-900 text-slate-100 transition-all duration-300 ease-out hover:[--dash-color:rgba(96,165,250,0.8)] hover:bg-slate-800"
            >
              <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
            </Link>

            <Link
              to="/signup"
              aria-label="Create Account"
              className="dash-frame inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.44)] bg-slate-800 text-slate-200 transition-all duration-300 ease-out hover:[--dash-color:rgba(148,163,184,0.56)] hover:bg-slate-700"
            >
              <HiOutlineUserPlus className="h-5 w-5" />
            </Link>
          </div>

          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            <Button to="/login" type="primary">
              Login
            </Button>

            <Button to="/signup" type="secondary">
              Create Account
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* CREATE POST */}
          <Button to={"/create-post"} type="primary">
            Create Post
          </Button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Logout"
            className="dash-frame inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800 text-slate-400 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:[--dash-color:rgba(248,113,113,0.55)] hover:bg-slate-700 hover:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-12"
          >
            <HiOutlineArrowLeftOnRectangle className="h-6 w-6" />
          </button>

          {/* NOTIFICATIONS */}
          <Link
            to="/notifications"
            className="dash-frame relative inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800 text-slate-400 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:[--dash-color:rgba(59,130,246,0.55)] hover:bg-slate-700 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:h-12 sm:w-12"
          >
            <HiOutlineBell className="h-6 w-6" />

            {unreadNotificationsCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 inline-flex min-h-[1.2rem] min-w-[1.2rem] items-center justify-center rounded-full border border-slate-500/60 bg-[#0b1120] px-1 text-[10px] font-semibold leading-none text-blue-200 shadow-md shadow-black/45">
                {unreadLabel}
              </span>
            ) : null}
          </Link>

          {/* AVATAR */}
          <Link
            to="/profile"
            className="dash-frame inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800 p-1 text-slate-400 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:[--dash-color:rgba(59,130,246,0.55)] hover:bg-slate-700 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:h-13 sm:w-13"
          >
            <img
              src={avatarSrc}
              alt={avatarAlt}
              className="h-full w-full rounded-full object-cover"
            />
          </Link>
        </>
      )}
    </div>
  );
}
