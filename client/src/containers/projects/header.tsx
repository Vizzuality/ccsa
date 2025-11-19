"use client";

import Link from "next/link";

import { useAtom, useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import { useGetProjects } from "@/types/generated/project";

import {
  projectSearchAtom,
  projectSortingAtom,
  useSyncCountries,
  useSyncPillars,
} from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import { LuArrowDownNarrowWide } from "react-icons/lu";
import { cn } from "@/lib/classnames";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectIcon,
} from "@/components/ui/select";

const ProjectsHeader = () => {
  const [projectSorting, setProjectSorting] = useAtom(projectSortingAtom);
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();
  const [countries] = useSyncCountries();

  const session = useSession();

  const { data } = useGetProjects(
    GET_PROJECTS_OPTIONS(
      projectSearch,
      {
        pillars,
        countries,
      },
      projectSorting,
    ),
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

  const handleSortingOrderChange = () => {
    setProjectSorting((prev) => ({
      field: prev.field,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <header className="flex w-full flex-col space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm">All projects</p>
        </div>

        <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
          <span className="font-semibold uppercase text-gray-400">Total number of projects:</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-200/50 font-semibold">
            {data?.meta?.pagination?.total ?? "-"}
          </span>
        </div>
      </div>
      <div className="flex w-full items-center justify-between space-x-2.5">
        <div className="flex w-fit items-center space-x-1">
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-400">
            Sorted by:
          </span>
          <Select
            value={projectSorting.field}
            defaultValue={projectSorting.field}
            onValueChange={(value) =>
              setProjectSorting({
                field: value as "name" | "status",
                order: projectSorting.order,
              })
            }
          >
            <SelectTrigger
              className={cn({
                "h-full w-full border-0 p-1": true,
              })}
            >
              <SelectValue
                placeholder="Select one"
                className="w-16 p-0 text-xs text-gray-700 focus:text-gray-700 "
              />
              <SelectIcon className="ml-1.5 h-6 w-6 stroke-[1.5px] text-gray-700 opacity-100" />
            </SelectTrigger>
            <SelectContent className="fit-width text-xs">
              <SelectItem className="text-gray-400 focus:text-xs" value="name">
                Name
              </SelectItem>
              <SelectItem className="text-xs text-gray-400 focus:text-xs" value="status">
                Status
              </SelectItem>
            </SelectContent>
          </Select>
          <LuArrowDownNarrowWide
            className={cn("flex h-6 w-6 shrink-0 items-end justify-end text-brand1", {
              "rotate-180": projectSorting.order === "asc",
            })}
            onClick={handleSortingOrderChange}
          />
        </div>
        {session.status === "authenticated" && (
          <Link
            href="/dashboard/projects"
            className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            Add new
          </Link>
        )}
      </div>
    </header>
  );
};

export default ProjectsHeader;
