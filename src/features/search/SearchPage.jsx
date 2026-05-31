import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageShell from "../../ui/PageShell";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import EmptyStateCard from "../../ui/EmptyStateCard";
import PostCard from "../posts/PostCard";
import CommunityExploreCard from "./components/CommunityExploreCard";
import UserResultCard from "./components/UserResultCard";
import SearchTabs from "./components/SearchTabs";
import {
  useSearchAll,
  useSearchPosts,
  useSearchCommunities,
  useSearchUsers,
} from "../../hooks/useSearchQueries";

const VALID_TABS = new Set(["all", "posts", "communities", "users"]);

function SectionHeader({ title, total, onSeeAll }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-slate-100">
        {title}
        {total != null ? (
          <span className="ml-2 text-xs font-normal text-slate-500">({total})</span>
        ) : null}
      </h2>
      {onSeeAll && total > 0 ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs font-semibold uppercase tracking-wide text-blue-400 transition hover:text-blue-300"
        >
          See all
        </button>
      ) : null}
    </div>
  );
}

function AllTab({ q, onSwitchTab }) {
  const { data, isLoading, error } = useSearchAll(q);

  if (isLoading) {
    return <AsyncStateNotice message="Searching..." />;
  }

  if (error) {
    return <AsyncStateNotice tone="error" message={error.message || "Search failed"} />;
  }

  if (!data) {
    return null;
  }

  const posts = data.posts?.items ?? [];
  const communities = data.communities?.items ?? [];
  const users = data.users?.items ?? [];
  const totalResults =
    (data.posts?.total ?? 0) + (data.communities?.total ?? 0) + (data.users?.total ?? 0);

  if (totalResults === 0) {
    return (
      <EmptyStateCard
        title={`No results for "${q}"`}
        description="Try different keywords or check your spelling."
      />
    );
  }

  return (
    <div className="space-y-8">
      {posts.length > 0 ? (
        <section>
          <SectionHeader
            title="Posts"
            total={data.posts.total}
            onSeeAll={() => onSwitchTab("posts")}
          />
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id ?? post._id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {communities.length > 0 ? (
        <section>
          <SectionHeader
            title="Communities"
            total={data.communities.total}
            onSeeAll={() => onSwitchTab("communities")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {communities.map((community) => (
              <CommunityExploreCard key={community.id ?? community._id} community={community} />
            ))}
          </div>
        </section>
      ) : null}

      {users.length > 0 ? (
        <section>
          <SectionHeader
            title="Users"
            total={data.users.total}
            onSeeAll={() => onSwitchTab("users")}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {users.map((user) => (
              <UserResultCard key={user._id ?? user.id} user={user} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function PostsTab({ q }) {
  const { data, isLoading, error } = useSearchPosts({ q, page: 1, limit: 20 });

  if (isLoading) return <AsyncStateNotice message="Searching posts..." />;
  if (error) return <AsyncStateNotice tone="error" message={error.message || "Search failed"} />;

  const posts = data?.posts ?? [];
  if (posts.length === 0) {
    return (
      <EmptyStateCard
        title={`No posts for "${q}"`}
        description="Try different keywords or check your spelling."
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id ?? post._id} post={post} />
      ))}
    </div>
  );
}

function CommunitiesTab({ q }) {
  const { data, isLoading, error } = useSearchCommunities({ q, page: 1, limit: 20 });

  if (isLoading) return <AsyncStateNotice message="Searching communities..." />;
  if (error) return <AsyncStateNotice tone="error" message={error.message || "Search failed"} />;

  const communities = data?.communities ?? [];
  if (communities.length === 0) {
    return (
      <EmptyStateCard
        title={`No communities for "${q}"`}
        description="Try different keywords or check your spelling."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {communities.map((community) => (
        <CommunityExploreCard key={community.id ?? community._id} community={community} />
      ))}
    </div>
  );
}

function UsersTab({ q }) {
  const { data, isLoading, error } = useSearchUsers({ q, page: 1, limit: 20 });

  if (isLoading) return <AsyncStateNotice message="Searching users..." />;
  if (error) return <AsyncStateNotice tone="error" message={error.message || "Search failed"} />;

  const users = data?.users ?? [];
  if (users.length === 0) {
    return (
      <EmptyStateCard
        title={`No users for "${q}"`}
        description="Try a different username or check your spelling."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <UserResultCard key={user._id ?? user.id} user={user} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const tabParam = searchParams.get("tab") ?? "all";
  const activeTab = VALID_TABS.has(tabParam) ? tabParam : "all";

  const { data: allData } = useSearchAll(q);

  const counts = useMemo(
    () => ({
      posts: allData?.posts?.total,
      communities: allData?.communities?.total,
      users: allData?.users?.total,
    }),
    [allData]
  );

  const switchTab = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === "all") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    setSearchParams(params, { replace: false });
  };

  if (!q) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <EmptyStateCard
          title="Search devTribe"
          description="Find posts, communities, and people. Start by typing a query in the header search bar."
          icon={<HiMagnifyingGlass className="h-8 w-8 text-slate-500" />}
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-100">
          Search results for{" "}
          <span className="text-blue-300">"{q}"</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse matches across posts, communities, and users.
        </p>
      </div>

      <SearchTabs activeTab={activeTab} onChange={switchTab} counts={counts} />

      {activeTab === "all" && <AllTab q={q} onSwitchTab={switchTab} />}
      {activeTab === "posts" && <PostsTab q={q} />}
      {activeTab === "communities" && <CommunitiesTab q={q} />}
      {activeTab === "users" && <UsersTab q={q} />}
    </PageShell>
  );
}
