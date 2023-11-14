"use client";

import { ChangeEventHandler } from "react";

import { useSetAtom } from "jotai";
import { useDebounce } from "rooks";

import { projectSearchAtom } from "@/app/store";

import { Search } from "@/components/ui/search";

const ProjectsSearch = () => {
  const setProjectsSearch = useSetAtom(projectSearchAtom);
  const setValueDebounced = useDebounce(setProjectsSearch, 500);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueDebounced(e.target.value);
  };

  return <Search placeholder="Search project by name" onChange={handleSearch} />;
};

export default ProjectsSearch;
