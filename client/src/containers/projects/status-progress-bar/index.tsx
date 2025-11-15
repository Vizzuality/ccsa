"use client";

import { ProjectStatus } from "@/types/generated/strapi.schemas";

const ProjectsStatusProgressBar = (status: ProjectStatus) => {
  if (!status) return null;
  return (
    <div className="mx-2 space-y-[5px]">
      <div className="flex shrink-0 space-x-[0.9px] whitespace-nowrap">
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className={`inline-block h-[5px] w-7 first:rounded-l-full last:rounded-r-full ${
              status.maturity && index + 1 <= status.maturity ? "bg-brand2" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <span className="text-xxs font-semibold uppercase tracking-wide">Projects status:</span>
        <span className="text-xs">{status?.name}</span>
      </div>
    </div>
  );
};

export default ProjectsStatusProgressBar;
