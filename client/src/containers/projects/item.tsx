"use client";

import { cn } from "@/lib/classnames";

import { ProjectListResponseDataItem } from "@/types/generated/strapi.schemas";

import { useSyncProject } from "@/app/store";

import { PROJECT_PILLARS } from "@/constants/projects";

const ProjectsItem = (project: ProjectListResponseDataItem) => {
  const { id, attributes } = project;
  const [, setProject] = useSyncProject();

  if (!attributes) return null;

  const { pillar, countries } = attributes;

  const handleClick = () => {
    if (!id) return;
    setProject(id);
  };

  return (
    <div
      className={cn({
        "group cursor-pointer space-y-2 pt-5": true,
      })}
      onClick={handleClick}
    >
      <h3 className="text-xs">
        <div
          className={cn({
            "mr-1 inline-block h-2 w-2 rounded-full bg-gradient-to-r": true,
            [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.color]: true,
          })}
        />
        {pillar?.data?.attributes?.name}
      </h3>
      <h2 className="pl-3 text-xl font-semibold text-gray-900 group-hover:underline">
        {project?.attributes?.name}
      </h2>

      <div className="pl-3 text-xxs">
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
