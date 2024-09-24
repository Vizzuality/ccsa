import CollaboratorsList from "@/containers/collaborators";
import CollaboratorsTitle from "@/containers/collaborators/title";

import PageTitle from "@/components/ui/page-title";

export default function CollaboratorsPage() {
  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full overflow-auto">
        <PageTitle />
        <div className="space-y-5 px-5 pb-10 pt-[30px]">
          <CollaboratorsTitle />

          <div className="space-y-5">
            <CollaboratorsList />
          </div>
        </div>
      </div>
    </div>
  );
}
