"use client";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/classnames";

import {
  projectSearchAtom,
  projectSortingAtom,
  useSyncCountries,
  useSyncPillars,
  useSyncProjectStatus,
} from "@/app/store";

import ProjectsItem from "@/containers/projects/item";

import { useGetProjectsWholeWordSearch } from "@/services/projects";

const Projects = () => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const projectsSorting = useAtomValue(projectSortingAtom);
  const [pillars] = useSyncPillars();
  const [countries] = useSyncCountries();
  const [status] = useSyncProjectStatus();

  const { data: projectsData } = useGetProjectsWholeWordSearch({
    q: projectSearch,
    pillars,
    countries,
    status,
    sortField: projectsSorting.field,
    sortOrder: projectsSorting.order,
    page: 1,
    pageSize: 200,
  });
  console.log(projectSearch, projectsData);
  return (
    <ul className="grid grid-cols-1 space-y-1.5">
      {projectsData?.data?.map((p) => {
        if (!p.id) return null;

        return (
          <li
            key={p.id}
            className="col-span-1 rounded-e-lg rounded-s-lg shadow-[0_4px_0_0_#EAEDF0] hover:bg-gray-100/50 hover:shadow-none"
          >
            <ProjectsItem {...p} />
          </li>
        );
      })}

      {projectsData?.data?.length === 0 && (
        <li className="col-span-1">
          <div
            className={cn({
              "group cursor-pointer space-y-2 rounded-lg border border-gray-200 p-5": true,
              // [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.selectedColor]: p === id,
            })}
            // onClick={handleClick}
          >
            <p className="text-center text-sm text-gray-700">No projects found</p>
          </div>
        </li>
      )}
    </ul>
  );
};

export default Projects;
