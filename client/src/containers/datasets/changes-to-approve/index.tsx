"use client";
import { useState, useEffect, useCallback } from "react";

import { useParams } from "next/navigation";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { useGetDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";

import { Data } from "@/components/forms/new-dataset/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { isObjectEmpty } from "@/lib/utils/objects";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { useGetCountries } from "@/types/generated/country";

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

interface DataObject {
  [key: string]: any;
}

function findAttributeValue(obj: DataObject, searchString: string): any {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // if (key === searchString) {
      //   return obj[key];
      // } TO - DO - change when we change from [countryISO]-[valueType] to countryISO

      if (key.includes(searchString)) {
        console.log(key);
        return obj[key];
      }

      // recursivity needed for resources
      if (typeof obj[key] === "object" && obj[key] !== null) {
        const result = findAttributeValue(obj[key], searchString);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
  return undefined;
}

function getObjectDifferences(obj1: Data, obj2: Data): (keyof Data)[] {
  if (!obj2) return [];

  const keys = new Set<keyof Data>([...Object.keys(obj1), ...Object.keys(obj2)] as (keyof Data)[]);

  const differences: (keyof Data)[] = [];

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

  // Check if there is previous data for that dataset
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

  const { data: datasetDataPendingToApprove } = useGetDatasetEditSuggestionsId(Number(id), {
    populate: "*",
  });

  const { data: countries } = useGetCountries(GET_COUNTRIES_OPTIONS);

  // useEffect(() => {
  //   const { colors, data, ...restSettings } = datasetDataPendingToApprove?.data?.attributes ?? {};

  //   const dataParsed = countries?.data?.map(({ attributes }) => {
  //     const countryIso = attributes?.iso3;

  //     if (!countryIso) {
  //       return {};
  //     }
  //     const valueType = datasetDataPendingToApprove?.data?.attributes?.value_type;
  //     const value = findAttributeValue(
  //       datasetDataPendingToApprove?.data?.attributes?.data,
  //       countryIso,
  //     );

  //     switch (valueType) {
  //       case "number":
  //         return { [countryIso]: value };
  //       case "text":
  //         return { [countryIso]: value };
  //       case "boolean":
  //         return { [countryIso]: value };
  //       default:
  //         return {};
  //     }
  //   });

  //   setFormValues({ settings: { ...restSettings }, data: dataParsed, colors });
  // }, [datasetData, datasetValuesData]);

  console.log(datasetDataPendingToApprove);
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

  // get the data from the dataset existente
  const d = datasetDataPendingToApprove?.data?.attributes;

  const { colors, data, ...settings } = d ?? {};

  const parsedDataChangesToApprove = {
    settings: { ...settings },
    data,
    colors,
  };

  const isNewDataset = isObjectEmpty(formValues);
  const diffKeys = isNewDataset ? [] : getObjectDifferences(formValues, parsedDataChangesToApprove);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        {/* <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{data?.name}</h1> */}
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Reject
          </Button>
          <Button size="sm">Approve</Button>
        </div>
      </div>
      <Tabs defaultValue="settings" className="w-full divide-y-2 divide-gray-300/20">
        <TabsList className="p-4 sm:px-10 md:px-24 lg:px-32">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsContentToApprove data={formValues} changes={diffKeys} />
        </TabsContent>
        <TabsContent value="data">
          {" "}
          <DataContentToApprove data={formValues} changes={diffKeys} />
        </TabsContent>
        <TabsContent value="colors">
          <ColorsContentToApprove data={formValues} changes={diffKeys} />
        </TabsContent>
      </Tabs>
    </>
  );
}
