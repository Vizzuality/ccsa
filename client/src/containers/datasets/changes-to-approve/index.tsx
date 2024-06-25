"use client";
import { useState, useEffect, useCallback } from "react";

import { useParams } from "next/navigation";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { useGetDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import type { Dataset } from "@/types/generated/strapi.schemas";

import { Data } from "@/components/forms/new-dataset/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";

export const DATA_INITIAL_VALUES: Data = {
  settings: {
    name: "",
    description: "",
    valueType: undefined,
    category: undefined,
    unit: "",
  },
  data: {},
  colors: {},
};

function getObjectDifferences(obj1: Dataset, obj2: Dataset): (keyof Dataset)[] {
  if (!obj2) return [];

  const keys = new Set<keyof Dataset>([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ] as (keyof Dataset)[]);

  const differences: (keyof Dataset)[] = [];

  keys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      differences.push(key);
    }
  });

  return differences.length > 0 ? differences : [];
}

export default function FormToApprove() {
  const params = useParams();
  const { id } = params;
  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  const { data: datasetData } = useGetDatasetsId(Number(id), {
    populate: "*",
  });

  const { data: datasetValuesData } = useGetDatasetValues({
    filters: {
      dataset: id,
    },
    populate: {
      country: {
        fields: ["name", "iso3"],
      },
      resources: true,
    },
  });

  useEffect(() => {
    const settings = {
      name: datasetData?.data?.attributes?.name || "",
      description: datasetData?.data?.attributes?.description || "",
      valueType: datasetData?.data?.attributes?.value_type || undefined,
      category: datasetData?.data?.attributes?.category?.data?.id || undefined,
      unit: datasetData?.data?.attributes?.unit,
    };

    const data =
      datasetValuesData?.data?.reduce(
        (acc, curr) => {
          const countryIso = curr?.attributes?.country?.data?.attributes?.iso3;

          if (datasetData?.data?.attributes?.value_type === "number") {
            return { ...acc, [`${countryIso}-number`]: curr?.attributes?.value_number };
          }

          if (datasetData?.data?.attributes?.value_type === "text") {
            return { ...acc, [`${countryIso}-text`]: curr?.attributes?.value_text };
          }

          // if (datasetData?.data?.attributes?.value_type === "boolean") {
          //   return { ...acc, [`${countryIso}-boolean`]: curr?.attributes?.value_boolean };
          // }

          return acc;
        },
        {} as Data["data"],
      ) || {};

    setFormValues({ settings, data, colors: {} });
  }, [datasetData, datasetValuesData]);

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
    },
    [formValues],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
    },
    [formValues],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      // TO - DO mutation to datasetEditsuggestion
    },
    [formValues],
  );

  const data = DatasetToApprove?.data?.attributes?.datum as Dataset;
  const valueType = DatasetToApprove?.data?.attributes?.value_type as Dataset["value_type"];
  const previousDatasetsData = PreviousDataset?.data?.attributes as Dataset;

  const diffKeys = !!data && getObjectDifferences(data, previousDatasetsData);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{data?.name}</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Reject
          </Button>
          <Button size="sm">Approve</Button>
        </div>
      </div>
      <Tabs defaultValue={tab} className="w-full divide-y-2 divide-gray-300/20">
        <TabsList className="p-4 sm:px-10 md:px-24 lg:px-32">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsContentToApprove data={data} changes={diffKeys} />
        </TabsContent>
        <TabsContent value="data">
          {" "}
          <DataContentToApprove data={data} changes={diffKeys} valueType={valueType} />
        </TabsContent>
        <TabsContent value="colors">
          <ColorsContentToApprove data={data} changes={diffKeys} valueType={valueType} />
        </TabsContent>
      </Tabs>
    </>
  );
}
