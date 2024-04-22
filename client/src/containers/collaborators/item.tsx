import Image from "next/image";

import { capitalize } from "lodash-es";
import { LuChevronDown, LuExternalLink } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { Collaborator, CollaboratorListResponseDataItem } from "@/types/generated/strapi.schemas";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type CollaboratorTypeItemProps = {
  id?: number;
  attributes?: Collaborator;
};

const CollaboratorTypeItem = ({ id, attributes }: CollaboratorTypeItemProps) => (
  <div
    key={id}
    className="group relative flex flex-col justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
  >
    <div className="absolute h-full w-full translate-y-full bg-gradient-to-t from-gray-600 to-white transition-all duration-500 group-hover:translate-y-0" />
    <div className="absolute z-20 w-full">
      <a
        className={cn(
          "flex w-full justify-between px-5 pb-2 font-open-sans text-xs font-semibold text-transparent group-hover:text-white",
        )}
        href={attributes?.link}
        target="_blank"
        rel="noreferrer"
      >
        {attributes?.name}
        <LuExternalLink className="ml-1 h-4 w-4 stroke-none group-hover:stroke-white" />
      </a>
    </div>
    <div className="relative z-10 flex min-h-[134px] w-full flex-1 items-center justify-center p-8">
      <Image
        src={`/images/collaborators/collaborator-${id}.png`}
        alt={attributes?.name || "Collaborator logo"}
        width={134}
        height={134}
      />
    </div>
  </div>
);

type CollaboratorItemProps = {
  collaboratorType: string;
  collaborators: CollaboratorListResponseDataItem[];
};

const CollaboratorItem = ({ collaboratorType, collaborators }: CollaboratorItemProps) => {
  return (
    <AccordionItem value={collaboratorType} className="space-y-4">
      <AccordionTrigger className="group flex items-center gap-4 py-2.5">
        <LuChevronDown className="h-6 w-6 stroke-[1.5px] text-gray-700 group-data-[state=open]:rotate-180" />
        <h2 className="font-open-sans text-xl">{`${capitalize(collaboratorType)}s`}</h2>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collaborators.map(({ attributes, id }) => (
              <CollaboratorTypeItem key={id} attributes={attributes} id={id} />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollaboratorItem;
