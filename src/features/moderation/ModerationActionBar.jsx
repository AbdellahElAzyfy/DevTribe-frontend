import { useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useApprovePost, useDeclinePost } from "../../hooks/useModerationQueries";

export default function ModerationActionBar({ post, onApproved, onDeclined }) {
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);

  const approveMutation = useApprovePost({
    onSuccess: (data) => onApproved?.(data, post),
  });

  const declineMutation = useDeclinePost({
    onSuccess: (data) => {
      setIsDeclineOpen(false);
      onDeclined?.(data, post);
    },
  });

  const isBusy = approveMutation.isPending || declineMutation.isPending;

  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-900/55 p-4 shadow-lg shadow-black/25 ring-1 ring-slate-800/40 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-300">
          <span className="font-semibold text-amber-300">Awaiting review</span>
          <span className="ml-2 text-slate-400">
            Approve to publish to the community feed, or decline to delete.
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsDeclineOpen(true)}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiXCircle className="h-4 w-4" />
            Decline
          </button>
          <button
            type="button"
            onClick={() => approveMutation.mutate(post.id)}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiCheckCircle className="h-4 w-4" />
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeclineOpen}
        title="Decline post"
        description="This will permanently delete the post along with any comments or votes. This cannot be undone."
        confirmLabel="Decline post"
        isLoading={declineMutation.isPending}
        onConfirm={() => declineMutation.mutate(post.id)}
        onClose={() => setIsDeclineOpen(false)}
      />
    </div>
  );
}
