"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { formatDate } from "@/lib/utils/formats";
import { getKeys } from "@/lib/utils/objects";

import { useGetDatasetsId } from "@/types/generated/dataset";
import { useGetDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import type {
  DatasetEditSuggestion,
  UsersPermissionsRole,
  UsersPermissionsUser,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";

import { DATA_INITIAL_VALUES } from "@/containers/datasets/new";

import { Data } from "@/components/forms/new-dataset/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";

type TabsProps = "settings" | "data" | "colors";

function getObjectDifferences(
  obj1: Data["settings"] | Data["data"] | Data["colors"],
  obj2: Data["settings"] | Data["data"] | Data["colors"],
): string[] {
  if (!obj1 || !obj2) return [];

  const keys = new Set([...getKeys(obj1), ...getKeys(obj2)]);

  const differences: string[] = [];

  keys.forEach((key) => {
    if (obj1[`${key}`] !== obj2[`${key}`]) {
      differences.push(`${key}`);
    }
  });

  return differences.length > 0 ? differences : [];
}

export default function FormToApprove() {
  const [tab, setTab] = useState<TabsProps>("settings");
  const { data: session } = useSession();
  const params = useParams();
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();
  const { id } = params;
  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  const { data: datasetDataPendingToApprove } = useGetDatasetEditSuggestionsId(Number(id), {
    populate: "*",
  });

  const datasetId = datasetDataPendingToApprove?.data?.attributes?.dataset?.data?.id;

  // Check previous data for that dataset
  const { data: datasetData } = useGetDatasetsId(
    Number(datasetId),
    {
      populate: "*",
    },
    {
      query: {
        enabled: !!datasetId,
      },
    },
  );

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const { data: datasetValuesData } = useGetDatasetValues(
    {
      filters: {
        dataset: datasetId,
      },
      populate: {
        country: {
          fields: ["name", "iso3"],
        },
        resources: true,
      },
    },
    {
      query: {
        enabled: !!datasetId,
      },
    },
  );

  const { mutate: mutateDatasetEditSuggestion } = usePostDatasetEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating dataset:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {},
  });

  const previousData = useMemo<Data | null>(() => {
    if (!datasetId) return null;

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
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_number };
          }

          if (datasetData?.data?.attributes?.value_type === "text") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_text };
          }

          if (datasetData?.data?.attributes?.value_type === "boolean") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_boolean };
          }

          return acc;
        },
        {} as Data["data"],
      ) || {};

    const colors = {};

    return { settings, data, colors };
  }, [datasetId, datasetData, datasetValuesData]);

  const ControlsStateId = {
    settings: "dataset-settings-approve-edition",
    data: "dataset-data-approve-edition",
    colors: "dataset-colors-approve-edition",
  } satisfies { [key in TabsProps]: string };

  useEffect(() => {
    const { colors, data, ...restSettings } =
      datasetDataPendingToApprove?.data?.attributes || ({} as DatasetEditSuggestion);

    setFormValues({
      settings: { ...restSettings, valueType: restSettings.value_type },
      data,
      colors,
    } as Data);
  }, [datasetData, datasetValuesData, datasetDataPendingToApprove]);

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
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

      // not updating correctly
      if (ME_DATA?.role?.type === "authenticated") {
        mutateDatasetEditSuggestion({
          data: {
            data: {
              ...data.settings,
              value_type: data.settings.valueType,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
            },
          },
        });
      }

      push(`/dashboard/?${URLParams.toString()}`);
    },
    [ME_DATA, formValues, mutateDatasetEditSuggestion],
  );

  const isNewDataset = !datasetDataPendingToApprove?.data?.attributes?.dataset?.data;

  const settingsChanges =
    isNewDataset || !previousData?.settings
      ? []
      : getObjectDifferences(formValues.settings, previousData?.settings);

  const dataChanges =
    isNewDataset || !previousData?.data
      ? []
      : getObjectDifferences(formValues.data, previousData?.data);

  const colorsChanges =
    isNewDataset || !previousData?.colors
      ? []
      : getObjectDifferences(formValues.colors, previousData?.colors);

  return (
    <>
      <div className="flex items-center justify-between py-4 sm:px-10 md:px-24 lg:px-32">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{formValues?.settings?.name}</h1>
          {formValues?.settings?.updatedAt && (
            <p className="text-sm text-gray-500">
              Last update: {formatDate(formValues?.settings?.updatedAt as string)}
            </p>
          )}
        </div>
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
        onValueChange={(e) => setTab(e as TabsProps)}
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
            isNewDataset={isNewDataset}
            changes={settingsChanges}
            handleSubmit={handleSettingsSubmit}
          />
        </TabsContent>
        <TabsContent value="data">
          <DataContentToApprove
            data={formValues}
            isNewDataset={isNewDataset}
            id={ControlsStateId.data}
            changes={dataChanges}
            handleSubmit={handleDataSubmit}
          />
        </TabsContent>
        <TabsContent value="colors">
          <ColorsContentToApprove
            data={formValues}
            id={ControlsStateId.colors}
            isNewDataset={isNewDataset}
            changes={colorsChanges}
            handleSubmit={handleColorsSubmit}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
