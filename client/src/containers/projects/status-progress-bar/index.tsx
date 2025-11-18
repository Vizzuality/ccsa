"use client";

import { ProjectStatus } from "@/types/generated/strapi.schemas";

export const ProgressBar = ({ maturity }: { maturity?: number }) => (
  <div className="flex shrink-0 space-x-[0.95px] whitespace-nowrap">
    {Array.from({ length: 6 }).map((_, index) => (
      <span
        key={index}
        className={`inline-block h-[5px] w-7 shrink-0 whitespace-nowrap first:rounded-l-full  last:rounded-r-full ${
          maturity && index + 1 <= maturity ? "bg-brand2" : "bg-gray-200"
        }`}
      />
    ))}
  </div>
);

const ProjectsStatusProgressBar = (status: ProjectStatus) => {
  if (!status) return null;
  return (
    <div className="space-y-3.5">
      <ProgressBar maturity={status.maturity} />
      <div className="flex flex-col">
        <span className="text-xxs font-semibold uppercase tracking-wide">Projects status:</span>
        <span className="text-xs">{status?.name}</span>
      </div>
    </div>
  );
};

export default ProjectsStatusProgressBar;
