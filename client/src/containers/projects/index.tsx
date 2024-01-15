"use client";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/classnames";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom, useSyncCountries, useSyncPillars } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import ProjectsItem from "@/containers/projects/item";

const Projects = () => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();
  const [countries] = useSyncCountries();

  const { data: projectsData } = useGetProjects(
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
    <ul className="grid grid-cols-1 space-y-1.5">
      {projectsData?.data?.map((p) => {
        if (!p.id) return null;

        return (
          <li key={p.id} className="col-span-1">
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
