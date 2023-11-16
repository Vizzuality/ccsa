"use client";

import { useAtomValue } from "jotai";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom, useSyncCountry, useSyncPillars } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

const ProjectsHeader = () => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();
  const [country] = useSyncCountry();

  const { data } = useGetProjects(
    GET_PROJECTS_OPTIONS(projectSearch, {
      pillars,
      country,
    }),
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

  return (
    <header className="flex items-center justify-between">
      <p className="text-sm">All projects</p>

      <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
        <span className="font-semibold uppercase text-gray-400">Total number of projects:</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-200/50 font-semibold">
          {data?.meta?.pagination?.total || "-"}
        </span>
      </div>
    </header>
  );
};

export default ProjectsHeader;
