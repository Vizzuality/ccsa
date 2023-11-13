"use client";

import { useEffect, useMemo, useState } from "react";

import { useAtomValue } from "jotai";

import { useGetCategories } from "@/types/generated/category";

import { datasetSearchAtom } from "@/app/store";

import CategoriesItem from "@/containers/datasets/categories/item";

import { Accordion } from "@/components/ui/accordion";

const DatasetsCategories = () => {
  const [values, setValues] = useState<string[]>();
  const datasetSearch = useAtomValue(datasetSearchAtom);

  const { data: categoriesData } = useGetCategories(
    {
      "pagination[pageSize]": 100,
      populate: "datasets",
      sort: "name:asc",
      filters: {
        ...(!!datasetSearch && {
          datasets: {
            name: {
              $containsi: datasetSearch,
            },
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

  const VALUE = useMemo(() => {
    if (!values) return categoriesData?.data?.map((c) => `${c?.id}`);

    return values;
  }, [values, categoriesData]);

  // Reset values when datasetSearch changes
  useEffect(() => {
    setValues(undefined);
  }, [datasetSearch]);

  return (
    <Accordion type="multiple" className="space-y-5" value={VALUE} onValueChange={setValues}>
      {categoriesData?.data?.map((category) => {
        if (!category.id) return null;

        return <CategoriesItem key={category.id} {...category} />;
      })}
    </Accordion>
  );
};

export default DatasetsCategories;
