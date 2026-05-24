import CommunityCard from "./CommunityCard";
import { useCommunitiesQuery } from "./useCommunityQueries";
import AsyncStateNotice from "../../ui/AsyncStateNotice";
import SimpleList from "../../ui/SimpleList";
import PageHeaderBlock from "../../ui/PageHeaderBlock";
import PageShell from "../../ui/PageShell";

export default function CommunitiesPage() {
  const { data: communities = [], isLoading, isError } = useCommunitiesQuery();

  if (isLoading) {
    return (
      <AsyncStateNotice message="Loading communities..." maxWidth="max-w-5xl" />
    );
  }

  if (isError) {
    return (
      <AsyncStateNotice
        message="Failed to load communities."
        tone="error"
        maxWidth="max-w-5xl"
      />
    );
  }

  return (
    <PageShell maxWidth="max-w-5xl">
      <PageHeaderBlock
        title="Explore Communities"
        description="Discover new spaces, join discussions, and find your tribe across the network."
      />

      <div className="mt-10 space-y-6">
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-slate-700/50 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              All Communities ({communities.length})
            </h2>
          </div>
          <SimpleList
            items={communities}
            className="grid gap-4 md:grid-cols-2"
            getKey={(community) => community.id}
            renderItem={(community) => <CommunityCard community={community} />}
          />
        </section>
      </div>
    </PageShell>
  );
}
