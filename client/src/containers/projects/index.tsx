"use client";

import { useAtomValue } from "jotai";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom, useSyncPillars } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import ProjectsItem from "@/containers/projects/item";

const Projects = () => {
  const projectSearch = useAtomValue(projectSearchAtom);
  const [pillars] = useSyncPillars();

  const { data: projectsData } = useGetProjects(
    GET_PROJECTS_OPTIONS(projectSearch, {
      pillars,
    }),
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

  return (
    <ul className="grid grid-cols-1 divide-y divide-gray-100">
      {projectsData?.data?.map((p) => {
        if (!p.id) return null;

        return (
          <li key={p.id} className="col-span-1 -mx-5">
            <ProjectsItem {...p} />
          </li>
        );
      })}
    </ul>
  );
};

export default Projects;
