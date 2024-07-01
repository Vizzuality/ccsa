"use client";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/classnames";

import { ProjectListResponseDataItem } from "@/types/generated/strapi.schemas";

import { projectSearchAtom, useSyncProject } from "@/app/store";

import { PROJECT_PILLARS } from "@/constants/projects";

import SearchHighlight from "@/components/ui/search-highlight";
import { useSession } from "next-auth/react";

const ProjectsItem = (project: ProjectListResponseDataItem) => {
  const { id, attributes } = project;
  const [p, setProject] = useSyncProject();
  const projectSearch = useAtomValue(projectSearchAtom);
  const { status } = useSession();

  if (!attributes) return null;

  const { pillar, countries } = attributes;

  const handleClick = () => {
    if (!id) return;

    if (p === id) return setProject(null);
    setProject(id);
  };

  return (
    <div
      className={cn({
        "group pointer-events-auto cursor-pointer space-y-2 rounded-lg border border-gray-200 p-5":
          true,
        [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.selectedColor]: p === id,
      })}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="flex items-center text-xs">
          <div
            className={cn({
              "mr-1.5 inline-block h-4 w-4 rounded-full bg-gradient-to-r shadow": true,
              [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.color]: true,
            })}
          />
          <span className="block">{pillar?.data?.attributes?.name}</span>
        </h3>
        {status === "authenticated" && (
          <Link
            href={`/dashboard/projects/${id}`}
            className="z-20 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 py-1 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            Edit
          </Link>
        )}
      </div>

      <h2 className="font-metropolis font-semibold text-gray-700 group-hover:underline">
        <SearchHighlight query={projectSearch}>{project?.attributes?.name}</SearchHighlight>
      </h2>

      <div className="space-x-px text-xxs">
        {countries?.data
          ?.reduce<string[]>((acc, curr) => {
            if (!curr.id || !curr.attributes?.name) return acc;
            return [...acc, curr.attributes.name];
          }, [])
          .join(", ")}
      </div>
    </div>
  );
};

export default ProjectsItem;
