"use client";

import { useAtomValue } from "jotai";

import { useGetDatasets } from "@/types/generated/dataset";

import { datasetSearchAtom, useSyncPublicationState } from "@/app/store";

import { GET_DATASETS_OPTIONS } from "@/constants/datasets";

import DatasetsItem from "@/containers/datasets/item";

type DatasetsProps = {
  categoryId: number;
};

const Datasets = ({ categoryId }: DatasetsProps) => {
  const datasetSearch = useAtomValue(datasetSearchAtom);
  const [publicationState] = useSyncPublicationState();

  const { data: datasetsData } = useGetDatasets(
    GET_DATASETS_OPTIONS(datasetSearch, categoryId, publicationState),
    {
      query: {
        keepPreviousData: true,
      },
    },
  );

  return (
    <div className="space-y-2.5">
      {datasetsData?.data?.map((dataset) => {
        return <DatasetsItem key={dataset?.id} {...dataset} />;
      })}
    </div>
  );
};

export default Datasets;
