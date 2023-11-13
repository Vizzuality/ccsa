"use client";

import { useAtomValue } from "jotai";

import { useGetProjects } from "@/types/generated/project";

import { projectSearchAtom } from "@/app/store";

import ProjectsItem from "@/containers/projects/item";

const Projects = () => {
  const projectSearch = useAtomValue(projectSearchAtom);

  const { data: projectsData } = useGetProjects(
    {
      "pagination[pageSize]": 200,
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

  console.log(projectsData);

  return (
    <ul>
      {projectsData?.data?.map((p) => {
        if (!p.id) return null;

        return <ProjectsItem key={p.id} {...p} />;
      })}
    </ul>
  );
};

export default Projects;
