import { useQueryClient } from "@tanstack/react-query";
import { HiArrowUp } from "react-icons/hi2";
import { clearPending, usePendingCount } from "./pendingNewPostsStore";

export default function NewPostsBanner({ listKey, label = "new posts" }) {
  const queryClient = useQueryClient();
  const count = usePendingCount(listKey);

  if (count <= 0) {
    return null;
  }

  const onClick = () => {
    queryClient.invalidateQueries({ queryKey: listKey });
    clearPending(listKey);
  };

  return (
    <div className="sticky top-2 z-20 mx-auto mb-3 flex w-full max-w-3xl justify-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-100 shadow-md shadow-black/30 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-500/25"
      >
        <HiArrowUp className="h-4 w-4" />
        <span>
          {count} {label} — click to load
        </span>
      </button>
    </div>
  );
}
