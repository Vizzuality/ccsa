"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

import { useParams } from "next/navigation";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { useGetDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";

import { Data } from "@/components/forms/new-dataset/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useSyncSearchParams } from "@/app/store";
import { isObjectEmpty } from "@/lib/utils/objects";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";
import NewDatasetFormControls from "@/components/new-dataset/form-controls";

import { DatasetEditSuggestion } from "@/types/generated/strapi.schemas";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { useGetCountries } from "@/types/generated/country";
import { DatasetDatasetEditSuggestions } from "@/types/generated/strapi.schemas";

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

type TabsProps = "settings" | "data" | "colors";

interface DataObject {
  [key: string]: any;
}

// function findAttributeValue(obj: DataObject, searchString: string): any {
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       // if (key === searchString) {
//       //   return obj[key];
//       // } TO - DO - change when we change from [countryISO]-[valueType] to countryISO

//       if (key.includes(searchString)) {
//         return obj[key];
//       }

//       // recursivity needed for resources
//       if (typeof obj[key] === "object" && obj[key] !== null) {
//         const result = findAttributeValue(obj[key], searchString);
//         if (result !== undefined) {
//           return result;
//         }
//       }
//     }
//   }
//   return undefined;
// }

function getObjectDifferences(
  obj1: Data,
  obj2: Data | { settings: Data["settings"]; data: Data["data"]; colors: {} },
): (keyof Data)[] {
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
  const [tab, setTab] = useState<TabsProps>("settings");
  const params = useParams();
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();
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

  useEffect(() => {
    const { colors, data, ...restSettings } = datasetDataPendingToApprove?.data?.attributes ?? {};

    setFormValues({ settings: { ...restSettings }, data, colors });
  }, [datasetData, datasetValuesData]);

  console.log(datasetDataPendingToApprove);

  const handleCancel = () => {
    replace(`/?${URLParams.toString()}`);
  };

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      console.log("approving en settings", values);
      setFormValues({ ...formValues, settings: values });
      setTab("data");
    },
    [formValues],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setTab("colors");
    },
    [formValues],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      const data = { ...formValues, colors: values };
      setFormValues(data);

      // if (ME_DATA?.role?.type === "authenticated") {
      //   mutateDatasetEditSuggestion({
      //     data: {
      //       data: {
      //         ...data.settings,
      //         value_type: data.settings.valueType,
      //         data: data.data,
      //         colors: data.colors,
      //         review_status: "pending",
      //         dataset: +id,
      //       },
      //     },
      //   });
      // }
    },
    [formValues],
  );

  // get the data from the dataset existente
  const previousDataDataset = datasetValuesData?.data;

  // const { colors, data, ...settings } = d ?? {};

  const parsedDataChangesToApprove = {
    settings: datasetData,
    data: previousDataDataset,
    colors: {},
  };

  const isNewDataset = datasetDataPendingToApprove?.data?.attributes?.dataset !== null;
  const diffKeys = isNewDataset ? [] : getObjectDifferences(formValues, parsedDataChangesToApprove);

  const ControlsStateId = {
    settings: "dataset-settings-approve-edition",
    data: "dataset-data-approve-edition",
    colors: "dataset-colors-approve-edition",
  } satisfies { [key in TabsProps]: string };
  console.log({ tab });
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{formValues?.settings?.name}</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline" onClick={handleCancel}>
            Reject
          </Button>
          <Button form={ControlsStateId[tab]} size="sm" type="submit">
            Approve
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue={tab}
        value={tab}
        className="w-full divide-y-2 divide-gray-300/20"
        onValueChange={(e) => {
          console.log(e);
          setTab(e as TabsProps);
        }}
      >
        <TabsList className="p-4 sm:px-10 md:px-24 lg:px-32">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsContentToApprove
            data={formValues}
            id={ControlsStateId.settings}
            changes={diffKeys}
            handleSubmit={handleSettingsSubmit}
          />
        </TabsContent>
        <TabsContent value="data">
          <DataContentToApprove
            data={formValues}
            id={ControlsStateId.data}
            changes={diffKeys}
            handleSubmit={handleDataSubmit}
          />
        </TabsContent>
        <TabsContent value="colors">
          <ColorsContentToApprove
            data={formValues}
            id={ControlsStateId.colors}
            changes={diffKeys}
            handleSubmit={handleColorsSubmit}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
