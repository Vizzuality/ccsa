"use client";

import { ChangeEventHandler } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { useDebounce } from "rooks";

import { datasetSearchAtom } from "@/app/store";

import { Search } from "@/components/ui/search";

const DatasetsSearch = () => {
  const datasetSearch = useAtomValue(datasetSearchAtom);
  const setDatasetSearch = useSetAtom(datasetSearchAtom);
  const setValueDebounced = useDebounce(setDatasetSearch, 500);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValueDebounced(e.target.value);
  };

  return (
    <Search
      defaultValue={datasetSearch}
      placeholder="Search dataset by name"
      onChange={handleSearch}
    />
  );
};

export default DatasetsSearch;
