import { useParams, useNavigate } from "react-router-dom";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useUserProfile } from "../../hooks/useUserQueries";
import { useAuth } from "../../hooks/useAuth";
import PageShell from "../../ui/PageShell";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import EmptyStateCard from "../../ui/EmptyStateCard";
import PostCard from "../posts/PostCard";
import resolveImageUrl from "../../utils/resolveImageUrl";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useUserProfile(username);

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <AsyncStateNotice state="loading" message="Loading profile..." />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <EmptyStateCard
          title="User not found"
          description={`The user @${username} does not exist or has been deleted.`}
        />
      </PageShell>
    );
  }

  const { user, posts, stats } = data;
  const isOwnProfile = currentUser?.username === user.username;

  const avatarSrc =
    resolveImageUrl(user.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <PageShell maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/55 p-6 shadow-lg shadow-black/15">
          <div className="flex items-start gap-6">
            <img
              src={avatarSrc}
              alt={user.username}
              className="h-24 w-24 shrink-0 rounded-full border-2 border-slate-700/70 object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">
                    @{user.username}
                  </h1>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-500/20 text-red-400"
                          : user.role === "moderator"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="text-sm text-slate-500">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
                {!isOwnProfile && (
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    <HiChatBubbleLeftRight className="h-4 w-4" />
                    Send Message
                  </button>
                )}
              </div>
              {user.bio && (
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {user.bio}
                </p>
              )}
              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-slate-100">
                    {stats.postCount}
                  </span>{" "}
                  <span className="text-slate-400">
                    {stats.postCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Posts</h2>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title="No posts yet"
              description={
                isOwnProfile
                  ? "You haven't created any posts yet."
                  : `@${user.username} hasn't created any posts yet.`
              }
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
