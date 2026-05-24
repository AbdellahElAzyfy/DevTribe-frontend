import PageShell from "../ui/PageShell";
import CreateCommunityForm from "../features/communities/components/CreateCommunityForm";
import PageHeaderBlock from "../ui/PageHeaderBlock";

export default function CreateCommunity() {
  return (
    <PageShell maxWidth="max-w-2xl">
      <PageHeaderBlock 
        title="Create a Community"
        description="A community is a place where people can share and discuss about specific topics."
      />
      
      <div className="mt-8">
        <CreateCommunityForm />
      </div>
    </PageShell>
  );
}
