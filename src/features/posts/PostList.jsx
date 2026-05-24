import PostCard from "./PostCard";
import { useFeedPostsQuery } from "./usePostQueries";

function PostList() {
  const { data: posts = [], isLoading, isError } = useFeedPostsQuery();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-slate-700/70 bg-slate-900/55 p-5 text-sm text-slate-400">
        Loading feed posts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-red-500/30 bg-slate-900/55 p-5 text-sm text-red-300">
        Failed to load feed posts.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-2 sm:gap-5 sm:pb-4">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}

export default PostList;
