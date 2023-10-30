"use client";

import { useGetDatasets } from "@/types/generated/dataset";

import DatasetsItem from "@/containers/datasets/item";

type DatasetsProps = {
  categoryId: number;
};

const Datasets = ({ categoryId }: DatasetsProps) => {
  const { data: datasetsData } = useGetDatasets({
    "pagination[pageSize]": 100,
    filters: {
      category: categoryId,
    },
    populate: "*",
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
