"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniq, compact } from "lodash-es";
import { z } from "zod";

import { useSyncSearchParams } from "@/app/store";

import type { Data } from "@/containers/datasets/new";

import NewDatasetFormControls from "@/components/new-dataset/form-controls";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/colorpicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { VALUE_TYPE } from "./types";
import NewDatasetDataFormWrapper from "./wrapper";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const getBooleanFormSchema = () =>
  z.object({
    true: z
      .string()
      .min(1, { message: "Please enter a color for TRUE" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for TRUE" }),
    false: z
      .string()
      .min(1, { message: "Please enter a color for FALSE" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for FALSE" }),
  });

const getNumberFormSchema = () =>
  z.object({
    minValue: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for min" }),
    maxValue: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for max" }),
  });

const getResourceFormSchema = () =>
  z.object({
    minValue: z
      .string()
      .min(1, { message: "Please enter a valid hex color for min" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for min" }),
    maxValue: z
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
  switch (valueType) {
    case "boolean":
      return getBooleanFormSchema();
    case "number":
      return getNumberFormSchema();
    case "resource":
      return getResourceFormSchema();
    case "text":
    default:
      return getTextFormSchema(categories);
  }
};

const getCategories = ({
  data,
  valueType,
}: {
  data: Data["data"];
  valueType?: VALUE_TYPE;
}): string[] | null => {
  if (!valueType || !data) return null;
  if (valueType === "resource") {
    return ["minValue", "maxValue"];
  }

  if (valueType === "text") {
    return compact(uniq(Object.values(data).map((value) => value as string)));
  }

  if (valueType === "number") {
    return ["minValue", "maxValue"];
  }

  if (valueType === "boolean") {
    return ["true", "false"];
  }

  return [];
};

const getDefaultValues = ({
  categories,
  valueType,
}: {
  categories: string[] | null;
  valueType?: VALUE_TYPE;
}): Record<string, string | number> => {
  if (!valueType || !categories) return {};
  switch (valueType) {
    case "boolean":
      return { true: "", false: "" };
    case "number":
      return { minValue: "", maxValue: "" };
    case "resource":
      return { minValue: "", maxValue: "" };
    case "text":
      return categories.reduce(
        (acc, category) => {
          return {
            ...acc,
            [category]: "",
          };
        },
        {} as Record<string, string | number>,
      );
    default:
      return {};
  }
};

export default function NewDatasetColorsForm({
  title,
  id,
  header = true,
  data: rawData,
  onSubmit,
}: {
  title: string;
  id: string;
  header: boolean;
  data: Data;
  onSubmit: (data: Data["colors"]) => void;
}) {
  const data = rawData.data;
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();

  const valueType = rawData?.settings?.valueType;

  const categories = getCategories({ data, valueType });

  const defaultValues = getDefaultValues({ categories, valueType });
  const formSchema = getFormSchema({ categories, valueType });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleCancel = () => {
    // onSubmit(DATA_INITIAL_VALUES.colors);
    replace(`/?${URLParams.toString()}`);
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

              {(valueType === "number" || valueType === "resource") && (
                <>
                  <FormField
                    key="minValue"
                    control={form.control}
                    name="minValue"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Min value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
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
                    key="maxValue"
                    control={form.control}
                    name="maxValue"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Max value</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
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

              {valueType === "boolean" && (
                <>
                  <FormField
                    control={form.control}
                    name="true"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Value for TRUE</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
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
                    control={form.control}
                    name="false"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Value for FALSE</FormLabel>
                        <FormControl>
                          <ColorPicker
                            id="color"
                            value={field.value}
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

            <Button type="submit" className="hidden">
              Submit
            </Button>
          </form>
        </Form>
      </NewDatasetDataFormWrapper>
    </>
  );
}
