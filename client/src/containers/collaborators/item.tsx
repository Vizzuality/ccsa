import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { capitalize } from "lodash-es";
import { useSession } from "next-auth/react";
import { LuChevronDown, LuExternalLink } from "react-icons/lu";

import { useGetCollaboratorsId } from "@/types/generated/collaborator";

import { cn } from "@/lib/classnames";

import { Collaborator, CollaboratorListResponseDataItem } from "@/types/generated/strapi.schemas";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import env from "@/env.mjs";

type CollaboratorTypeItemProps = {
  id?: number;
  attributes?: Collaborator;
  status?: "authenticated" | "loading" | "unauthenticated";
};

function checkImage(url: string, callback: (isValid: boolean) => void) {
  const img = document.createElement("img"); // Create an HTML image element

  img.onload = function () {
    callback(true); // Image is valid
  };

  img.onerror = function () {
    callback(false); // Image is broken
  };

  img.src = url; // Set the image source
}

const CollaboratorTypeItem = ({ id, attributes, status }: CollaboratorTypeItemProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: collaboratorData } = useGetCollaboratorsId(
    id as number,
    {
      populate: "*",
    },
    {
      query: {
        enabled: !!id,
      },
    },
  );

  useEffect(() => {
    const fallbackUrl = `/images/collaborators/collaborator-${id}.png`;
    const placeholderUrl = `/images/collaborators/no-image-placeholder.png`;

    // First image to check (from collaboratorData)
    const initialUrl =
      collaboratorData?.data?.attributes?.image?.data?.attributes?.url || fallbackUrl;

    checkImage(initialUrl, (isValid) => {
      if (isValid) {
        setImageUrl(initialUrl);
      } else {
        checkImage(fallbackUrl, (isFallbackValid) => {
          if (isFallbackValid) {
            setImageUrl(fallbackUrl);
          } else {
            setImageUrl(placeholderUrl); // Use the placeholder if both images are broken
          }
        });
      }
    });
  }, [id, collaboratorData]);

  return (
    <div
      key={id}
      className="group relative flex flex-col justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      {status === "authenticated" && (
        <Link
          href={`/dashboard/collaborators/${id}`}
          className="absolute right-2 top-2 z-20 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 py-1 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
        >
          Edit
        </Link>
      )}

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
          src={
            imageUrl
              ? `
            ${collaboratorData?.data?.attributes?.image?.data?.attributes?.url}`
              : `/images/collaborators/no-image-placeholder.png`
          }
          alt={attributes?.name || "Collaborator logo"}
          width={imageUrl ? 134 : 90}
          height={imageUrl ? 134 : 90}
        />
      </div>
    </div>
  );
};

type CollaboratorItemProps = {
  collaboratorType: string;
  collaborators: CollaboratorListResponseDataItem[];
};

const CollaboratorItem = ({ collaboratorType, collaborators }: CollaboratorItemProps) => {
  const { status } = useSession();
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
              <CollaboratorTypeItem key={id} attributes={attributes} id={id} status={status} />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollaboratorItem;
