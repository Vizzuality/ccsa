"use client";

import { ChangeEventHandler } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { useDebounce } from "rooks";

import { projectSearchAtom } from "@/app/store";

import ProjectsFiltersDialog from "@/containers/projects/filters/dialog";

import { Search } from "@/components/ui/search";

const ProjectsFilters = () => {
  const projectsSearch = useAtomValue(projectSearchAtom);
  const setProjectsSearch = useSetAtom(projectSearchAtom);
  const setValueDebounced = useDebounce(setProjectsSearch, 500);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueDebounced(e.target.value);
  };

  return (
    <div className="flex space-x-1">
      <Search
        defaultValue={projectsSearch}
        placeholder="Search project by name"
        onChange={handleSearch}
      />

      <ProjectsFiltersDialog />
    </div>
  );
};

export default ProjectsFilters;
