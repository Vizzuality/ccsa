"use client";

import { useAtomValue } from "jotai";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom } from "@/app/store";

import { GET_PROJECTS_OPTIONS } from "@/constants/projects";

import ProjectsItem from "@/containers/projects/item";

const Projects = () => {
  const projectSearch = useAtomValue(projectSearchAtom);

  const { data: projectsData } = useGetProjects(GET_PROJECTS_OPTIONS(projectSearch), {
    query: {
      keepPreviousData: true,
    },
  });

  return (
    <ul className="grid grid-cols-1 gap-5 divide-y divide-gray-200">
      {projectsData?.data?.map((p) => {
        if (!p.id) return null;

        return (
          <li key={p.id} className="col-span-1">
            <ProjectsItem {...p} />
          </li>
        );
      })}
    </ul>
  );
};

export default Projects;
