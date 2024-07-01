"use client";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { useSession } from "next-auth/react";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom, useSyncCountries, useSyncPillars } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

const ProjectsHeader = () => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();
  const [countries] = useSyncCountries();
  const session = useSession();

  const { data } = useGetProjects(
    GET_PROJECTS_OPTIONS(projectSearch, {
      pillars,
      countries,
    }),
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm">All projects</p>
        {session.status === "authenticated" && (
          <Link
            href="/dashboard/projects"
            className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            Add new
          </Link>
        )}
      </div>
      <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
        <span className="font-semibold uppercase text-gray-400">Total number of projects:</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-200/50 font-semibold">
          {data?.meta?.pagination?.total ?? "-"}
        </span>
      </div>
    </header>
  );
};

export default ProjectsHeader;
