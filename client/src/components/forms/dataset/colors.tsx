"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { uniq, compact } from "lodash-es";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import {
  getGetDatasetEditSuggestionsIdQueryKey,
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

import type { Data, VALUE_TYPE } from "./types";
import NewDatasetDataFormWrapper from "./wrapper";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const getDefaultFormSchema = () =>
  z.object({
    min: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for min" }),
    max: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for max" }),
  });

const getBooleanFormSchema = () =>
  z.object({
    yes: z
      .string()
      .min(1, { message: "Please enter a valid hex color for YES" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for YES" }),
    no: z
      .string()
      .min(1, { message: "Please enter a valid hex color for NO" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for NO" }),
  });

const getTextFormSchema = (categories: string[] | null): z.ZodObject<z.ZodRawShape> => {
  if (!categories) return z.object({});
  const schemaShape = categories.reduce(
    (acc, category) => {
      return {
        ...acc,
        [category]: z
          .string()
          .min(1, { message: "Please chose a color" })
          .regex(hexColorRegex, { message: "Please enter a valid hex color" }),
      };
    },
    {} as Record<string, z.ZodString>,
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
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  onSubmit: (data: Data["colors"]) => void;
  changes?: string[];
}) {
  const data = rawData.data;
  const colors = rawData.colors;
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const URLParams = useSyncSearchParams();

  const { data: datasetDataPendingToApprove } = useGetDatasetEditSuggestionsId(Number(id), {
    populate: "*",
  });

  const { data: session } = useSession();
  const user = session?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

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
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error updating dataset:", error);
      },
    },
    request: {},
  });

  const values = useMemo(() => {
    if (value_type === "text") {
      return categories!.reduce(
        (acc, category) => {
          return {
            ...acc,
            [category]: colors[category] || "",
          };
        },
        {} as Record<string, string | number>,
      );
    }
    if (value_type === "boolean") {
      return {
        yes: colors.yes,
        no: colors.no,
      };
    }
    return {
      min: colors.min,
      max: colors.max,
    };
  }, [colors, categories, value_type]);

  const formSchema = getFormSchema({ categories, value_type });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values,
  });

  const handleCancel = () => {
    onSubmit(INITIAL_DATASET_VALUES.colors);
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      onSubmit(values);
    },
    [onSubmit],
  );
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
  if (!value_type) return null;

  return (
    <>
      {header && (
        <DashboardFormControls
          isNew={!id}
          title={title}
          id={id}
          cancelVariant={ME_DATA?.role?.type === "admin" && !!id ? "reject" : "cancel"}
          handleReject={handleReject}
          handleCancel={handleCancel}
        />
      )}
      <NewDatasetDataFormWrapper header={header}>
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
                              "bg-green-400": changes?.includes(field.name),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
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
                              "bg-green-400": changes?.includes(field.name),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
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
                              "bg-green-400": changes?.includes(field.name),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
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
                              "bg-green-400": changes?.includes(field.name),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
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
                              "bg-green-400": changes?.includes(field.name),
                            })}
                            onChange={(e) => {
                              return field.onChange(e.target.value);
                            }}
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
      </NewDatasetDataFormWrapper>
    </>
  );
}
