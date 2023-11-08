"use client";

import { ChangeEventHandler } from "react";

import { useSetAtom } from "jotai";
import { useDebounce } from "rooks";

import { datasetSearchAtom } from "@/app/store";

import { Search } from "@/components/ui/search";

const DatasetsSearch = () => {
  const setDatasetSearch = useSetAtom(datasetSearchAtom);
  const setValueDebounced = useDebounce(setDatasetSearch, 500);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueDebounced(e.target.value);
  };

  return <Search placeholder="Search dataset by name" onChange={handleSearch} />;
};

export default DatasetsSearch;
