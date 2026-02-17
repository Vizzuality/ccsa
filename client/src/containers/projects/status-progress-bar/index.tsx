"use client";

import { ProjectStatus } from "@/types/generated/strapi.schemas";

const ProgressBar = ({ maturity }: { maturity?: number }) => (
  <div className="flex shrink-0 space-x-[0.95px] whitespace-nowrap">
    {Array.from({ length: 4 }).map((_, index) => (
      <span
        key={index}
        className={`inline-block h-[5px] w-7 shrink-0 whitespace-nowrap bg-brand2  first:rounded-l-full last:rounded-r-full ${
          maturity && index + 1 <= maturity ? "opacity-100" : "opacity-20"
        }`}
      />
    ))}
  </div>
);

export const ProjectsStatusProgressBar = (status: ProjectStatus) => (
  <div className="space-y-3.5">
    {status.maturity && <ProgressBar maturity={status.state} />}
    <div className="flex items-center space-x-1">
      <span className="text-xxs font-semibold uppercase tracking-wide text-gray-500">
        Projects status:
      </span>
      <span className="text-xs">{status?.name || "Not provided"}</span>
    </div>
  </div>
);

export default ProjectsStatusProgressBar;
