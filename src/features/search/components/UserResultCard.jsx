import { Link } from "react-router-dom";
import resolveImageUrl from "../../../utils/resolveImageUrl";

const roleBadgeClass = (role) => {
  if (role === "admin") return "bg-red-500/20 text-red-400";
  if (role === "moderator") return "bg-blue-500/20 text-blue-400";
  return "bg-slate-700/50 text-slate-400";
};

export default function UserResultCard({ user }) {
  const avatarSrc =
    resolveImageUrl(user.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <Link
      to={`/profile/${user.username}`}
      className="group flex items-start gap-4 rounded-xl border border-slate-700/70 bg-slate-900/55 p-4 shadow-lg shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-slate-500/70 hover:bg-slate-900/80"
    >
      <img
        src={avatarSrc}
        alt={user.username}
        className="h-12 w-12 shrink-0 rounded-full border border-slate-700/70 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-100 group-hover:text-blue-300">
            @{user.username}
          </h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleBadgeClass(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
        {user.bio ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {user.bio}
          </p>
        ) : (
          <p className="mt-1 text-sm italic text-slate-600">No bio yet.</p>
        )}
      </div>
    </Link>
  );
}
