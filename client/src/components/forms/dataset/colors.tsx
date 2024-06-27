"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniq, compact } from "lodash-es";
import { z } from "zod";

import { useSyncSearchParams } from "@/app/store";

import NewDatasetFormControls from "@/components/new-dataset/form-controls";
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
import { cn } from "@/lib/classnames";

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
  valueType,
}: {
  categories: string[] | null;
  valueType?: VALUE_TYPE;
}) => {
  if (valueType === "text") {
    return getTextFormSchema(categories);
  }

  return getDefaultFormSchema();
};

const getCategories = ({
  data,
  valueType,
}: {
  data: Data["data"];
  valueType?: VALUE_TYPE;
}): string[] | null => {
  if (!valueType || !data) return null;

  if (valueType === "text") {
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
  const URLParams = useSyncSearchParams();

  const valueType = rawData?.settings?.valueType;

  const categories = getCategories({ data, valueType });

  const values = useMemo(() => {
    if (valueType === "text") {
      return categories!.reduce(
        (acc, category) => {
          return {
            ...acc,
            [category]: "",
          };
        },
        {} as Record<string, string | number>,
      );
    }

    return {
      min: colors.min,
      max: colors.max,
    };
  }, [colors]);

  const formSchema = getFormSchema({ categories, valueType });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values,
  });

  const handleCancel = () => {
    // onSubmit(DATA_INITIAL_VALUES.colors);
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      onSubmit(values);
    },
    [onSubmit],
  );

  if (!valueType) return null;

  return (
    <>
      {header && <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />}
      <NewDatasetDataFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} />}
        {header && <StepDescription />}

        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset className="grid grid-cols-2 gap-6">
              {/* {valueType === "number" && <DynamicForm form={form} />} */}
              {valueType === "text" &&
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

              {(valueType === "number" || valueType === "resource" || valueType === "boolean") && (
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
            </fieldset>
          </form>
        </Form>
      </NewDatasetDataFormWrapper>
    </>
  );
}
