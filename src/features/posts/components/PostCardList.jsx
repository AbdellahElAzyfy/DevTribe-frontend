import PostCard from "../PostCard";

export default function PostCardList({ posts, className = "space-y-4" }) {
  return (
    <div className={className}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
