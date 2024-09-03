"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { uniq, compact } from "lodash-es";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import chroma from "chroma-js";

import {
  getGetDatasetEditSuggestionsIdQueryKey,
  useDeleteDatasetEditSuggestionsId,
  useGetDatasetEditSuggestionsId,
} from "@/types/generated/dataset-edit-suggestion";
import { usePutDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams, INITIAL_DATASET_VALUES } from "@/app/store";

import DashboardFormControls from "@/components/new-dataset/form-controls";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import ColorPicker from "@/components/ui/colorpicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DEFAULT_COLORS } from "@/components/forms/dataset/constants";
import type { Data, VALUE_TYPE } from "./types";
import DashboardFormWrapper from "./wrapper";
import { useDeleteDatasetsId } from "@/types/generated/dataset";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const getDefaultFormSchema = () =>
  z.object({
    min: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for min" })
      .optional(),

    max: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for max" })
      .optional(),
  });

const getBooleanFormSchema = () =>
  z.object({
    yes: z
      .string()
      .min(1, { message: "Please enter a valid hex color for YES" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for YES" })
      .optional(),
    no: z
      .string()
      .min(1, { message: "Please enter a valid hex color for NO" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for NO" })
      .optional(),
  });

const getTextFormSchema = (categories: string[] | null): z.ZodObject<z.ZodRawShape> => {
  if (!categories) return z.object({});

  const schemaShape = categories.reduce(
    (acc: Record<string, z.ZodOptional<z.ZodString>>, category) => {
      acc[category] = z
        .string()
        .min(1, { message: "Please choose a color" })
        .regex(hexColorRegex, { message: "Please enter a valid hex color" })
        .optional();
      return acc;
    },
    {},
  );

  return z.object(schemaShape);
};

const getFormSchema = ({
  categories,
  value_type,
}: {
  categories: string[] | null;
  value_type?: VALUE_TYPE;
}) => {
  if (value_type === "text") {
    return getTextFormSchema(categories);
  }

  if (value_type === "boolean") {
    return getBooleanFormSchema();
  }

  return getDefaultFormSchema();
};

const getCategories = ({
  data,
  value_type,
}: {
  data: Data["data"];
  value_type?: VALUE_TYPE;
}): string[] | null => {
  if (!value_type || !data) return null;

  if (value_type === "text") {
    return compact(uniq(Object.values(data).map((value) => value as string)));
  }

  return ["min", "max"];
};

export default function DatasetColorsForm({
  title,
  id,
  header = true,
  data: rawData,
  onSubmit,
  changes,
  status,
  message,
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  onSubmit: (data: Data["colors"]) => void;
  changes?: string[];
  status?: "approved" | "pending" | "declined" | undefined;
  message?: string;
}) {
  const data = rawData.data;
  const colors = rawData.colors;
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const URLParams = useSyncSearchParams();

  const params = useParams();
  const { id: datasetId } = params;

  const { data: datasetDataPendingToApprove } = useGetDatasetEditSuggestionsId(Number(datasetId), {
    populate: "*",
  });

  const { data: session } = useSession();
  const user = session?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

  const previousData = (datasetDataPendingToApprove?.data?.attributes?.colors ||
    colors) as Data["colors"];
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const value_type = rawData?.settings?.value_type;

  const categories = getCategories({ data, value_type });

  const { mutate: mutatePutDatasetEditSuggestion } = usePutDatasetEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getGetDatasetEditSuggestionsIdQueryKey(Number(id)),
        });
        console.info("Success updating dataset:", data);
        toast.success("Dataset updating dataset suggestion");
        if (
          data?.data?.attributes?.review_status === "declined" ||
          data?.data?.attributes?.review_status === "pending" ||
          ME_DATA?.role?.type === "authenticated"
        ) {
          push(`/dataset/${id}`);
        }
        push(`/dashboard`);
      },
      onError: (error) => {
        toast.error("Error updating dataset suggestion");
        console.error("Error updating dataset:", error);
      },
    },
    request: {},
  });

  const { mutate: mutateDeleteDatasetsId } = useDeleteDatasetsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success deleting dataset:", data);
        toast.success("Dataset deleted");
        push(`/dashboard`);
      },
      onError: (error) => {
        toast.error("Error deleting dataset");
        console.error("Error deleting dataset:", error);
      },
    },
  });

  const { mutate: mutateDeleteDatasetEditSuggestionsId } = useDeleteDatasetEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success deleting suggested dataset:", data);
        toast.success("Success deleting suggested dataset");
        push(`/dashboard`);
      },
      onError: (error) => {
        toast.error("Error deleting suggested dataset");
        console.error("Error deleting suggested dataset :", error);
      },
    },
  });

  const values = useMemo(() => {
    if (value_type === "text") {
      const colorsLength = categories?.length;
      const defaultColors = chroma
        .scale([DEFAULT_COLORS.min, DEFAULT_COLORS.max])
        .colors(colorsLength);
      return categories!.reduce(
        (acc, category, i) => {
          return {
            ...acc,
            [category]: previousData?.[category] || defaultColors[i],
          };
        },
        {} as Record<string, string | number>,
      );
    }
    if (value_type === "boolean") {
      return {
        yes: previousData?.yes || DEFAULT_COLORS.max,
        no: previousData.no || DEFAULT_COLORS.min,
      };
    }
    return {
      min: previousData?.min || DEFAULT_COLORS.min,
      max: previousData?.max || DEFAULT_COLORS.max,
    };
  }, [previousData, categories, value_type]);

  const formSchema = getFormSchema({ categories, value_type });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values,
  });

  const handleCancel = () => {
    onSubmit(INITIAL_DATASET_VALUES.colors);
    push(`/?${URLParams.toString()}`);
  };

  const handleDelete = useCallback(() => {
    if (datasetDataPendingToApprove?.data?.id) {
      mutateDeleteDatasetEditSuggestionsId({ id: +datasetId });
    } else {
      mutateDeleteDatasetsId({ id: +datasetId });
    }
  }, [mutateDeleteDatasetsId, id]);

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      onSubmit(values);
    },
    [onSubmit],
  );
  const handleReject = ({ message }: { message?: string }) => {
    if (ME_DATA?.role?.type === "admin" && datasetDataPendingToApprove?.data?.id) {
      mutatePutDatasetEditSuggestion({
        id: datasetDataPendingToApprove?.data?.id,
        data: {
          data: {
            review_status: "declined",
            review_decision_details: message,
          },
        },
      });
    }
  };
  if (!value_type) return null;

  return (
    <>
      {header && (
        <DashboardFormControls
          isNew={!id}
          title={title}
          id={id}
          handleReject={handleReject}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          message={message}
        />
      )}
      <DashboardFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} form={form} />}
        {header && <StepDescription />}

        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset className="grid grid-cols-2 gap-6">
              {/* {value_type === "number" && <DynamicForm form={form} />} */}
              {value_type === "text" &&
                categories?.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={category}
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">{category}</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
                            className={cn({
                              "bg-green-400 placeholder:text-gray-400": changes?.includes(
                                field.name,
                              ),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
                            disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

              {(value_type === "number" || value_type === "resource") && (
                <>
                  <FormField
                    key="min"
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Min value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
                            className={cn({
                              "bg-green-400 placeholder:text-gray-400": changes?.includes(
                                field.name,
                              ),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
                            disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="max"
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Max value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
                            className={cn({
                              "bg-green-400 placeholder:text-gray-400": changes?.includes(
                                field.name,
                              ),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
                            disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {value_type === "boolean" && (
                <>
                  <FormField
                    key="no"
                    control={form.control}
                    name="yes"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">YES value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
                            className={cn({
                              "bg-green-400 placeholder:text-gray-400": changes?.includes(
                                field.name,
                              ),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
                            disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="no"
                    control={form.control}
                    name="no"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">NO value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
                            className={cn({
                              "bg-green-400 placeholder:text-gray-400": changes?.includes(
                                field.name,
                              ),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
                            disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </fieldset>
          </form>
        </Form>
      </DashboardFormWrapper>
    </>
  );
}
