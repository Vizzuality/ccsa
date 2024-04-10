import CollaboratorsList from "@/containers/collaborators";

import PageTitle from "@/components/ui/page-title";

export default function CollaboratorsPage() {
  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full overflow-auto">
        <PageTitle />
        <div className="space-y-5 px-5 pb-10 pt-[30px]">
          <h1 className="font-metropolis text-3xl tracking-tight text-gray-700">Collaborators</h1>

          <div className="space-y-5">
            {
              <CollaboratorsList />
              /* <OtherToolsList /> */
            }
          </div>
        </div>
      </div>
    </div>
  );
}
