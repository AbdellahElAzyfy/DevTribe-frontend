import { useState } from "react";

import PostCard from "../posts/PostCard";
import EditProfileModal from "./EditProfileModal";
import { useProfileQuery } from "./useProfileQuery";
import { useListPosts } from "../../hooks/usePostQueries";
import { useAuth } from "../../hooks/useAuth";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import SimpleList from "../../ui/SimpleList";
import PageShell from "../../ui/PageShell";
import EmptyStateCard from "../../ui/EmptyStateCard";

import resolveImageUrl from "../../utils/resolveImageUrl";

const ROLE_LABELS = {
  user: "Member",
  moderator: "Moderator",
  admin: "Admin",
};

function formatJoinedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const { fetchMe } = useAuth();
  const { data: profile, isLoading, isError } = useProfileQuery();
  const [isEditing, setIsEditing] = useState(false);

  const { data: postsData, isLoading: isLoadingPosts } = useListPosts(
    { authorId: profile?.id },
    { enabled: !!profile?.id }
  );

  if (isLoading) {
    return (
      <AsyncStateNotice message="Loading profile..." maxWidth="max-w-4xl" />
    );
  }

  if (isError || !profile) {
    return (
      <AsyncStateNotice
        message="Failed to load profile data."
        tone="error"
        maxWidth="max-w-4xl"
      />
    );
  }

  const userPosts = Array.isArray(postsData) ? postsData : [];

  const avatarSrc =
    resolveImageUrl(profile.avatar) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username || "default"}`;

  const joinedDate = formatJoinedDate(profile.createdAt);
  const roleLabel = ROLE_LABELS[profile.role] || ROLE_LABELS.user;

  return (
    <PageShell maxWidth="max-w-4xl">
      <section className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/60 shadow-lg shadow-black/20">
        {/* Decorative cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-slate-800/40" />

        <div className="p-5 sm:p-6">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4 sm:-mt-16">
            <div className="flex items-end gap-4">
              <img
                src={avatarSrc}
                alt={profile.username}
                className="h-24 w-24 rounded-2xl border-4 border-[#0b1120] object-cover shadow-lg shadow-black/40 sm:h-28 sm:w-28"
              />

              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
                    @{profile.username}
                  </h1>
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                    {roleLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{profile.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-400/60 hover:bg-slate-700"
            >
              Edit profile
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            {profile.bio || "No bio yet."}
          </p>

          {/* Real stats only */}
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-3 py-2 text-slate-200">
              {userPosts.length.toLocaleString()}{" "}
              {userPosts.length === 1 ? "post" : "posts"}
            </span>
            {joinedDate ? (
              <span className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-3 py-2 text-slate-200">
                Joined {joinedDate}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {isLoadingPosts ? (
        <div className="flex justify-center p-8">
          <p className="text-slate-400">Loading posts...</p>
        </div>
      ) : userPosts.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">
            Posts
          </h2>
          <SimpleList
            items={userPosts}
            className="space-y-4"
            getKey={(post) => post.id}
            renderItem={(post) => <PostCard post={post} />}
          />
        </section>
      ) : (
        <EmptyStateCard
          title="No posts yet"
          description="You have not published any posts."
        />
      )}

      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
        onUpdated={() => fetchMe()}
      />
    </PageShell>
  );
}
