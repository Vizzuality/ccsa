"use client";

import { useState, useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";

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

import { INITIAL_DATASET_VALUES } from "@/app/store";

import { Data, VALUE_TYPE } from "@/components/forms/dataset/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { updateOrCreateDataset } from "@/services/datasets";

import ColorsContentToApprove from "./colors-content";
import DataContentToApprove from "./data-content";
import SettingsContentToApprove from "./settings-content";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";

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
    Number(datasetId) || Number(id),
    {
      populate: "*",
    },
    {
      query: {
        enabled: !!datasetId || !!id,
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
        dataset: id,
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
        enabled: !!id,
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
        if (ME_DATA?.role?.type === "authenticated") {
          toast.success("Success updating dataset suggestion");
          push(`/dashboard`);
        }
        if (
          data?.data?.attributes?.review_status === "declined" ||
          data?.data?.attributes?.review_status === "pending"
        ) {
          push(`/dashboard`);
        }
        push(`/`);
      },
      onError: (error) => {
        toast.error("There was a problem updating the dataset suggestion");
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
      name: datasetDataPendingToApprove?.data?.attributes?.name || "",
      description: datasetDataPendingToApprove?.data?.attributes?.description || "",
      value_type: datasetDataPendingToApprove?.data?.attributes?.value_type || undefined,
      category: datasetDataPendingToApprove?.data?.attributes?.category?.data?.id || undefined,
      unit: datasetDataPendingToApprove?.data?.attributes?.unit,
    };

    const data =
      (datasetDataPendingToApprove?.data?.attributes?.data as Data["data"]) ||
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
      ) ||
      {};

    const colors =
      datasetDataPendingToApprove?.data?.attributes?.colors ||
      (previousDataSource?.data?.attributes?.layers?.data || [])[0]?.attributes?.colors ||
      ({} as Data["colors"]);
    return { settings, data, colors };
  }, [datasetValuesData, previousDataSource]);

  const DATA_PREVIOUS_VALUES = useMemo(() => {
    previousDataSource?.data?.attributes || ({} as DatasetEditSuggestion);

    return {
      settings: {
        ...datasetData?.data?.attributes,
        category: datasetData?.data?.attributes?.category?.data?.id,
        value_type: datasetData?.data?.attributes?.value_type as VALUE_TYPE,
      },
      data:
        {
          ...datasetValuesData?.data?.reduce(
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
          ),
        } || {},
      colors: datasetData?.data?.attributes?.layers?.data?.[0]?.attributes?.colors,
    } as Data;
  }, [datasetData, datasetValuesData, previousDataSource?.data?.attributes?.value_type]);

  const PENDING_TO_APPROVE_DATA = useMemo(() => {
    datasetDataPendingToApprove?.data?.attributes || ({} as DatasetEditSuggestion);

    return {
      settings: {
        ...datasetDataPendingToApprove?.data?.attributes,
        category: datasetDataPendingToApprove?.data?.attributes?.category?.data?.id,
        value_type: datasetDataPendingToApprove?.data?.attributes?.value_type as VALUE_TYPE,
      },
      data: datasetDataPendingToApprove?.data?.attributes?.data || {},
      // {
      //   ...datasetValuesData?.data?.reduce(
      //     (acc, curr) => {
      //       const countryIso = curr?.attributes?.country?.data?.attributes?.iso3;

      //       if (datasetData?.data?.attributes?.value_type === "number") {
      //         return { ...acc, [`${countryIso}`]: curr?.attributes?.value_number };
      //       }

      //       if (datasetData?.data?.attributes?.value_type === "text") {
      //         return { ...acc, [`${countryIso}`]: curr?.attributes?.value_text };
      //       }

      //       if (datasetData?.data?.attributes?.value_type === "boolean") {
      //         return { ...acc, [`${countryIso}`]: curr?.attributes?.value_boolean };
      //       }

      //       if (previousDataSource?.data?.attributes?.value_type === "resource") {
      //         return {
      //           ...acc,
      //           [`${countryIso}`]: curr?.attributes?.resources?.data?.map(
      //             ({ attributes }) => attributes as Resource,
      //           ),
      //         };
      //       }
      //       return acc;
      //     },
      //     {} as Data["data"],
      //   ),
      // } || {},
      colors: datasetData?.data?.attributes?.layers?.data?.[0]?.attributes?.colors,
    } as Data;
  }, [datasetData, datasetValuesData, previousDataSource?.data?.attributes?.value_type]);

  const [formValues, setFormValues] = useState<Data>(PENDING_TO_APPROVE_DATA);

  const formSchema = z.object({
    message: z.string().min(1, { message: "Please provide a reason for the rejection" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const ControlsStateId = {
    settings: "dataset-settings-approve-edition",
    data: "dataset-data-approve-edition",
    colors: "dataset-colors-approve-edition",
  } satisfies { [key in TabsProps]: string };

  const handleReject = useCallback((values: z.infer<typeof formSchema>) => {
    if (ME_DATA?.role?.type === "admin" && datasetDataPendingToApprove?.data?.id) {
      mutatePutDatasetEditSuggestion({
        id: datasetDataPendingToApprove?.data?.id,
        data: {
          data: {
            review_status: "declined",
            review_decision_details: values.message,
          },
        },
      });
      push(`/dashboard`);
    }
  }, []);

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
        const { value_type } = data?.settings || {};

        const parsedData = getDataParsed(value_type, data);

        mutatePutDatasetEditSuggestion({
          id: datasetDataPendingToApprove?.data?.id,
          data: {
            data: {
              ...data.settings,
              category: data?.settings?.category as number,
              value_type: data.settings?.value_type as VALUE_TYPE,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
            },
          },
        });
      }

      if (ME_DATA?.role?.type === "admin" && session?.apiToken) {
        const { value_type } = data?.settings || {};
        const parsedData = getDataParsed(value_type, data);

        updateOrCreateDataset(
          {
            ...(id && !datasetDataPendingToApprove && { dataset_id: id }),
            ...(id &&
              !!datasetDataPendingToApprove && {
                dataset_id: datasetData?.data?.id,
              }),

            ...parsedData,
            // @ts-expect-error TO-DO - fix types
            dataset_edit_suggestion_ids: parsedData?.dataset_edit_suggestions?.data.map(
              (d: { id: number }) => d?.id,
            ),
          },
          session?.apiToken,
          // to do review data + change sug status
        )
          .then((data) => {
            console.info("Success creating dataset:", data);
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
            setFormValues(INITIAL_DATASET_VALUES);
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
            <Dialog>
              <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl py-4">
                <DialogTitle className="p-4">Reasons for Suggestion Rejection</DialogTitle>
                <Form {...form}>
                  <form
                    id="decline-message"
                    className="space-y-4 px-4"
                    onSubmit={form.handleSubmit(handleReject)}
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value}
                              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                              placeholder="Entry your message here"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pb-4">
                      <Button size="sm" form="decline-message">
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
            status={datasetDataPendingToApprove?.data?.attributes?.review_status}
            message={datasetDataPendingToApprove?.data?.attributes?.review_decision_details}
          />
        </TabsContent>
        <TabsContent value="data">
          <DataContentToApprove
            data={formValues}
            isNewDataset={isNewDataset}
            id={ControlsStateId.data}
            changes={dataChanges}
            handleSubmit={handleDataSubmit}
            status={datasetDataPendingToApprove?.data?.attributes?.review_status}
            message={datasetDataPendingToApprove?.data?.attributes?.review_decision_details}
          />
        </TabsContent>
        <TabsContent value="colors">
          <ColorsContentToApprove
            data={formValues}
            id={ControlsStateId.colors}
            isNewDataset={isNewDataset}
            changes={colorsChanges}
            handleSubmit={handleColorsSubmit}
            status={datasetDataPendingToApprove?.data?.attributes?.review_status}
            message={datasetDataPendingToApprove?.data?.attributes?.review_decision_details}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
