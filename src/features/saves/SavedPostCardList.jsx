import SavedPostCard from "./SavedPostCard";

export default function SavedPostCardList({ posts, onRemove, className = "" }) {
  return (
    <div
      className={`grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {posts.map((post) => (
        <SavedPostCard key={post.id} post={post} onRemove={onRemove} />
      ))}
    </div>
  );
}
