import PostCardList from "./components/PostCardList";
import { useFeedPostsQuery } from "./usePostQueries";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import NewPostsBanner from "../../realtime/NewPostsBanner";
import { queryKeys } from "../../lib/queryKeys";

const FEED_PARAMS = { sortBy: "newest" };

export default function HomeFeedPage() {
  const { data: posts = [], isLoading, isError } = useFeedPostsQuery(FEED_PARAMS);

  if (isLoading) {
    return (
      <AsyncStateNotice message="Loading feed posts..." maxWidth="max-w-3xl" />
    );
  }

  if (isError) {
    return (
      <AsyncStateNotice
        message="Failed to load feed posts."
        tone="error"
        maxWidth="max-w-3xl"
      />
    );
  }

  return (
    <>
      <NewPostsBanner listKey={queryKeys.posts.feed(FEED_PARAMS)} />
      <PostCardList
        posts={posts}
        className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-2 sm:gap-5 sm:pb-4"
      />
    </>
  );
}
