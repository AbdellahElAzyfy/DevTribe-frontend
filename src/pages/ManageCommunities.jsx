import { useState } from "react";
import PageShell from "../ui/PageShell";
import PageHeaderBlock from "../ui/PageHeaderBlock";
import CreateCommunityModal from "../features/communities/components/CreateCommunityModal";
import { useCommunitiesQuery } from "../features/communities/useCommunityQueries";
import { useAuth } from "../hooks/useAuth";
import ModerationCommunityCard from "../features/communities/components/ModerationCommunityCard";
import SimpleList from "../ui/SimpleList";
import { HiShieldCheck, HiPlus } from "react-icons/hi2";

export default function ManageCommunities() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState(null);
  const { data: communities = [], isLoading } = useCommunitiesQuery();

  // Filter for communities where the user is an owner
  const moderatedCommunities = communities.filter(c => c.createdBy === user?.id);

  const handleEdit = (community) => {
    setCommunityToEdit(community);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCommunityToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCommunityToEdit(null);
  };

  return (
    <PageShell maxWidth="max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
            <HiShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-100 uppercase">Moderation Hub</h1>
            <p className="text-sm text-slate-500 font-medium">Oversee your digital tribes and creation suite.</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
        >
          <HiPlus className="h-5 w-5" />
          Create Community
        </button>
      </div>

      <div className="mt-12">
        {/* Management List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Communities You Lead ({moderatedCommunities.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Fetching your spaces...</p>
            </div>
          ) : moderatedCommunities.length > 0 ? (
            <SimpleList
              items={moderatedCommunities}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
              getKey={(c) => c.id}
              renderItem={(c) => (
                <ModerationCommunityCard 
                  community={c} 
                  onEdit={handleEdit} 
                />
              )}
            />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-800/50 bg-slate-950/40 p-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-slate-700">
                <HiShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Your empire is empty</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                You haven't established any communities yet. Click the "Create Community" button above to start your first space.
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateCommunityModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        communityToEdit={communityToEdit}
      />
    </PageShell>
  );
}
