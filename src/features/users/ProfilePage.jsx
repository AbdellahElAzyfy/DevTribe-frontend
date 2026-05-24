import PostCard from "../posts/PostCard";
import { useProfileQuery } from "./useProfileQuery";
import { useListPosts } from "../../hooks/usePostQueries";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import SimpleList from "../../ui/SimpleList";
import PageShell from "../../ui/PageShell";
import EmptyStateCard from "../../ui/EmptyStateCard";

import resolveImageUrl from "../../utils/resolveImageUrl";

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfileQuery();

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
  
  const avatarSrc = resolveImageUrl(profile.avatar) || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username || "default"}`;
    
  const coverSrc = resolveImageUrl(profile.coverImage) || 
    "https://images.unsplash.com/photo-1579546678183-a84849910d8e?q=80&w=2070&auto=format&fit=crop";

  return (
    <PageShell maxWidth="max-w-4xl">
      <section className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/60 shadow-lg shadow-black/20">
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverSrc})` }}
        />

        <div className="p-5 sm:p-6">
          <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
            <img
              src={avatarSrc}
              alt={profile.username}
              className="h-24 w-24 rounded-2xl border-4 border-[#0b1120] object-cover shadow-lg shadow-black/40 sm:h-28 sm:w-28"
            />

            <div className="pb-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
                @{profile.username}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{profile.email}</p>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            {profile.bio || "No bio yet."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{profile.location}</span>
            <span>{profile.joinedAt}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-3 py-2 text-slate-200">
              {(profile.followers ?? 0).toLocaleString()} followers
            </span>
            <span className="rounded-lg border border-slate-700/70 bg-slate-800/70 px-3 py-2 text-slate-200">
              {(profile.following ?? 0).toLocaleString()} following
            </span>
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
          description="This user has not published any posts."
        />
      )}
    </PageShell>
  );
}
