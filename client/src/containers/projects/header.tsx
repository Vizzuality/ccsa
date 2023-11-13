"use client";

import { useAtomValue } from "jotai";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom } from "@/app/store";

const ProjectsHeader = () => {
  const projectSearch = useAtomValue(projectSearchAtom);

  const { data } = useGetProjects(
    {
      "pagination[pageSize]": -1,
      populate: "sdgs,pillar",
      sort: "name:asc",
      filters: {
        ...(!!projectSearch && {
          name: {
            $containsi: projectSearch,
          },
        }),
      },
    },
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
