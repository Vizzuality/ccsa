"use client";

import { useAtomValue } from "jotai";

import { useGetDatasets } from "@/types/generated/dataset";

import { datasetSearchAtom } from "@/app/store";

import DatasetsItem from "@/containers/datasets/item";

type DatasetsProps = {
  categoryId: number;
};

const Datasets = ({ categoryId }: DatasetsProps) => {
  const datasetSearch = useAtomValue(datasetSearchAtom);

  const { data: datasetsData } = useGetDatasets({
    "pagination[pageSize]": 100,
    filters: {
      category: categoryId,
      ...(!!datasetSearch && {
        name: {
          $containsi: datasetSearch,
        },
      }),
    },
    populate: "*",
    sort: "name:asc",
  });

  return (
    <div className="space-y-2.5">
      {datasetsData?.data?.map((dataset) => {
        return <DatasetsItem key={dataset?.id} {...dataset} />;
      })}
    </div>
  );
};

export default Datasets;
