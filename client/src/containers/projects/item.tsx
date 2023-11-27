"use client";

import { cn } from "@/lib/classnames";

import { ProjectListResponseDataItem } from "@/types/generated/strapi.schemas";

import { useSyncProject } from "@/app/store";

import { PROJECT_PILLARS } from "@/constants/projects";

const ProjectsItem = (project: ProjectListResponseDataItem) => {
  const { id, attributes } = project;
  const [p, setProject] = useSyncProject();

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
        "group cursor-pointer space-y-2 rounded-lg border border-gray-200 p-5": true,
        [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.selectedColor]: p === id,
      })}
      onClick={handleClick}
    >
      <h3 className="flex items-center text-xs">
        <div
          className={cn({
            "mr-1.5 inline-block h-4 w-4 rounded-full bg-gradient-to-r shadow": true,
            [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.color]: true,
          })}
        />
        <span className="block">{pillar?.data?.attributes?.name}</span>
      </h3>

      <h2 className="font-metropolis text-lg font-semibold text-gray-800 group-hover:underline">
        {project?.attributes?.name}
      </h2>

      <div className="text-xxs">
        {countries?.data
          ?.map((c) => {
            if (!c.id || !c.attributes) return null;

            return c.attributes.name;
          })
          .join(", ")}
      </div>
    </div>
  );
};

export default ProjectsItem;
