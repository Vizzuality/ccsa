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
        "group cursor-pointer space-y-2 rounded-xl bg-gradient-to-r p-5 text-white": true,
        [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.color]: true,
      })}
      onClick={handleClick}
    >
      <h3 className="text-xs">{pillar?.data?.attributes?.name}</h3>
      <h2 className="font-metropolis text-lg font-black tracking-tight group-hover:underline">
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
