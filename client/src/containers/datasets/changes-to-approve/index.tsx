"use client";

import { useState, useCallback, useMemo } from "react";

import { toast } from "react-toastify";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getDataParsed } from "@/lib/utils/datasets";
import { formatDate } from "@/lib/utils/formats";
import { compareDatasetsDataObjects, getObjectDifferences } from "@/lib/utils/objects";

import { useGetDatasetsId } from "@/types/generated/dataset";
import {
  getGetDatasetEditSuggestionsIdQueryKey,
  useGetDatasetEditSuggestionsId,
} from "@/types/generated/dataset-edit-suggestion";
import { usePutDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import type {
  CategoryResponse,
  DatasetEditSuggestion,
  Resource,
  UsersPermissionsRole,
  UsersPermissionsUser,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { Data, VALUE_TYPE } from "@/components/forms/dataset/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { updateOrCreateDataset } from "@/services/datasets";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";

type TabsProps = "settings" | "data" | "colors";

export default function FormToApprove() {
  const [tab, setTab] = useState<TabsProps>("settings");
  const { data: session } = useSession();
  const params = useParams();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;

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
      "pagination[pageSize]": 300,
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

  const { mutate: mutatePutDatasetEditSuggestion } = usePutDatasetEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getGetDatasetEditSuggestionsIdQueryKey(Number(id)),
        });
        console.info("Success updating dataset:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error updating dataset:", error);
      },
    },
    request: {},
  });

  const previousDataSource = datasetDataPendingToApprove || datasetData;

  const previousData = useMemo<Data | null>(() => {
    if (!previousDataSource) {
      return null;
    }

    const settings = {
      name: previousDataSource?.data?.attributes?.name || "",
      description: previousDataSource?.data?.attributes?.description || "",
      value_type: previousDataSource?.data?.attributes?.value_type || undefined,
      category: previousDataSource?.data?.attributes?.category?.data?.id || undefined,
      unit: previousDataSource?.data?.attributes?.unit,
    };

    const data =
      datasetValuesData?.data?.reduce(
        (acc, curr) => {
          const countryIso = curr?.attributes?.country?.data?.attributes?.iso3;

          if (previousDataSource?.data?.attributes?.value_type === "number") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_number };
          }

          if (previousDataSource?.data?.attributes?.value_type === "text") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_text };
          }

          if (previousDataSource?.data?.attributes?.value_type === "boolean") {
            return { ...acc, [`${countryIso}`]: curr?.attributes?.value_boolean };
          }

          if (previousDataSource?.data?.attributes?.value_type === "resource") {
            return {
              ...acc,
              [`${countryIso}`]: curr?.attributes?.resources?.data?.map(
                ({ attributes }) => attributes as Resource,
              ),
            };
          }

          return acc;
        },
        {} as Data["data"],
      ) || {};

    const colors =
      (previousDataSource?.data?.attributes?.layers?.data || [])[0]?.attributes?.colors ||
      ({} as Data["colors"]);

    return { settings, data, colors };
  }, [datasetValuesData, previousDataSource]);

  const DATA_INITIAL_VALUES = useMemo(() => {
    const { colors, data, ...restSettings } =
      datasetDataPendingToApprove?.data?.attributes || ({} as DatasetEditSuggestion);

    return {
      settings: { ...restSettings, value_type: restSettings.value_type },
      data: data,
      colors: colors,
    } as Data;
  }, [datasetDataPendingToApprove]);

  const [formValues, setFormValues] = useState<Data>(DATA_INITIAL_VALUES);

  const ControlsStateId = {
    settings: "dataset-settings-approve-edition",
    data: "dataset-data-approve-edition",
    colors: "dataset-colors-approve-edition",
  } satisfies { [key in TabsProps]: string };

  const handleReject = () => {
    if (ME_DATA?.role?.type === "admin" && datasetDataPendingToApprove?.data?.id) {
      mutatePutDatasetEditSuggestion({
        id: datasetDataPendingToApprove?.data?.id,
        data: {
          data: {
            review_status: "declined",
          },
        },
      });
    }
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
      if (ME_DATA?.role?.type === "authenticated" && datasetDataPendingToApprove?.data?.id) {
        mutatePutDatasetEditSuggestion({
          id: datasetDataPendingToApprove?.data?.id,
          data: {
            data: {
              ...data.settings,
              category: data.settings.category as number,
              value_type: data.settings.value_type as VALUE_TYPE,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
            },
          },
        });
      }

      if (ME_DATA?.role?.type === "admin" && session?.apiToken) {
        const { value_type } = data.settings;
        const parsedData = getDataParsed(value_type, data);
        updateOrCreateDataset(
          {
            ...(id && !datasetDataPendingToApprove && { dataset_id: id }),
            ...(id &&
              !!datasetDataPendingToApprove && {
                dataset_id: datasetData?.data?.id,
              }),
            ...parsedData,
          },
          session?.apiToken,
          // to do review data + change sug status
        )
          .then((data) => {
            console.info("Success updating dataset:", data);
            toast.success("Success creating dataset");

            if (datasetDataPendingToApprove?.data?.id) {
              mutatePutDatasetEditSuggestion({
                id: datasetDataPendingToApprove?.data?.id,
                data: {
                  data: {
                    ...data.settings,
                    value_type: data.value_type,
                    data: data.data,
                    colors: data.colors,
                    review_status: "approved",
                  },
                },
              });
            }
            setFormValues(DATA_INITIAL_VALUES);
            push(`/`);
          })
          .catch((error: Error) => {
            if (error) {
              toast.error("There was a problem creating the dataset");
              console.error("Error creating dataset:", error);
            }
          });
      }
    },
    [
      ME_DATA,
      formValues,
      datasetDataPendingToApprove,
      mutatePutDatasetEditSuggestion,
      datasetData?.data?.id,
      id,
      session?.apiToken,
      push,
      DATA_INITIAL_VALUES,
    ],
  );

  const isNewDataset = !datasetDataPendingToApprove?.data?.attributes?.dataset?.data;
  interface ParsedSettings extends Omit<Data["settings"], "category"> {
    category: CategoryResponse;
  }

  // Need to parse data that comes from relations to be able to compare it
  const parseSettings = {
    ...previousData?.settings,
    // @ts-expect-error TO-DO - fix types - category comes from a relation
    category: previousData?.settings?.category?.data?.id || previousData?.settings?.category,
  } as ParsedSettings;

  const parsedFormValues = {
    ...formValues?.settings,
    // @ts-expect-error TO-DO - fix types - category comes from a relation
    category: formValues?.settings?.category?.data?.id || previousData?.settings?.category,
  } as ParsedSettings;

  const settingsChanges = !previousData?.settings
    ? []
    : getObjectDifferences(parsedFormValues, parseSettings);

  const dataChanges =
    !previousData?.data && !formValues.settings.value_type
      ? []
      : compareDatasetsDataObjects(
          formValues.data,
          previousData?.data,
          formValues.settings?.value_type,
        );

  const colorsChanges = !previousData?.colors
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
          <Link href="/dashboard">
            <Button size="sm" variant="primary-outline">
              Cancel
            </Button>
          </Link>

          {ME_DATA?.role?.type === "admin" && (
            <Button size="sm" variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          )}

          <Button form={ControlsStateId[tab]} size="sm" type="submit">
            {ME_DATA?.role?.type === "authenticated" ? "Submit" : "Approve"}
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
