import { HiPencil, HiTrash, HiUsers } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useDeleteCommunity } from "../../../hooks/useCommunityQueries";
import { useState } from "react";

export default function ModerationCommunityCard({ community, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteCommunity({
    onSuccess: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you absolutely sure you want to delete r/${community.slug}? This action cannot be undone.`)) {
      deleteMutation.mutate(community.slug);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800/60">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            to={`/community/${community.slug}`}
            className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors"
          >
            r/{community.slug}
          </Link>
          <p className="mt-1 text-sm font-medium text-slate-400 line-clamp-1">{community.name}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <HiUsers className="h-4 w-4" />
              <span>{community.memberCount} members</span>
            </div>
            <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              community.isPrivate ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              {community.isPrivate ? "Private" : "Public"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(community)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-blue-600 hover:text-white"
            title="Edit Community"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-rose-600 hover:text-white disabled:opacity-50"
            title="Delete Community"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-500 line-clamp-2 italic">
          "{community.description || "No description provided."}"
        </p>
      </div>
    </div>
  );
}
