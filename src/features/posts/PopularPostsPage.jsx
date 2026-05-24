import PostCardList from "./components/PostCardList";
import PostsSectionHeader from "./components/PostsSectionHeader";
import { usePopularPostsQuery } from "./usePostQueries";
import PageShell from "../../ui/PageShell";
import EmptyStateCard from "../../ui/EmptyStateCard";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import NewPostsBanner from "../../realtime/NewPostsBanner";
import { queryKeys } from "../../lib/queryKeys";

const POPULAR_PARAMS = { sortBy: "top" };

export default function PopularPostsPage() {
  const { data: posts = [], isLoading, isError } = usePopularPostsQuery();

  if (isLoading) {
    return (
      <AsyncStateNotice
        message="Loading the most popular posts..."
        maxWidth="max-w-4xl"
      />
    );
  }

  if (isError) {
    return (
      <AsyncStateNotice
        message="Failed to load popular posts. Please try again later."
        tone="error"
        maxWidth="max-w-4xl"
      />
    );
  }

  return (
    <PageShell maxWidth="max-w-4xl">
      <PostsSectionHeader
        title="Popular posts"
        description="The highest-rated content on DevTribe, ranked by the community."
      />

      <NewPostsBanner listKey={queryKeys.posts.feed(POPULAR_PARAMS)} />

      {posts.length ? (
        <PostCardList posts={posts} />
      ) : (
        <EmptyStateCard
          title="No popular posts found"
          description="It looks like there aren't any upvoted posts yet. Be the first to start a trend!"
        />
      )}
    </PageShell>
  );
}
