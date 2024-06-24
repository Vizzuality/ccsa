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
      .min(1, { message: "Please enter a color for TRUE" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for TRUE" }),
    maxValue: z
      .string()
      .min(1, { message: "Please enter a color for FALSE" })
      .regex(hexColorRegex, { message: "Please enter a valid hex color for FALSE" }),
  });

const getResourceFormSchema = (categories: string[]): z.ZodObject<z.ZodRawShape> => {
  const schemaShape = categories.reduce(
    (acc, category) => {
      acc[category] = z
        .string()
        .min(1, { message: "Please enter a title" })
        .regex(hexColorRegex, { message: "Please enter a valid hex color" });
      return acc;
    },
    {} as Record<string, z.ZodString>,
  );

  return z.object(schemaShape);
};

const getTextFormSchema = (categories: string[]): z.ZodObject<z.ZodRawShape> => {
  const schemaShape = categories.reduce(
    (acc, category) => {
      acc[category] = z
        .string()
        .min(1, { message: "Please enter a title" })
        .regex(hexColorRegex, { message: "Please enter a valid hex color" });
      return acc;
    },
    {} as Record<string, z.ZodString>,
  );

  return z.object(schemaShape);
};

const getFormSchema = (valueType: VALUE_TYPE, categories: string[]) => {
  switch (valueType) {
    case "boolean":
      return getBooleanFormSchema();
    case "number":
      return getNumberFormSchema();
    case "resource":
      return getResourceFormSchema(categories);
    case "text":
    default:
      return getTextFormSchema(categories);
  }
};

const getCategories = (data: Data["data"], valueType?: VALUE_TYPE): string[] | null => {
  if (!valueType || !data) return null;
  if (valueType === "resource") {
    return compact(
      uniq(
        Object.entries(data.data)
          .filter(([key]) => key.includes("title"))
          .map(([, value]) => value as string),
      ),
    );
  } else if (valueType === "text") {
    return compact(uniq(Object.values(data.data).map((value) => value as string)));
  } else {
    return [];
  }
};

const getDefaultValues = (
  categories: string[],
  valueType?: VALUE_TYPE,
): Record<string, any> | null => {
  if (!valueType || !categories) return null;
  switch (valueType) {
    case "boolean":
      return { true: "", false: "" };
    case "number":
      return { minValue: "", maxValue: "" };
    case "resource":
    case "text":
      return categories.reduce(
        (acc, category) => {
          acc[category] = "";
          return acc;
        },
        {} as Record<string, string> | null,
      );
    default:
      return {};
  }
};

export default function NewDatasetColorsForm({
  id,
  title,
  data,
  onSubmit,
}: {
  id: string;
  title: string;
  data: Data;
  onSubmit: (data: Data["colors"]) => void;
  valueType?: VALUE_TYPE;
}) {
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();

  const valueType = data?.settings?.valueType;
  const categoriesData = data.data;

  console.log(categoriesData);

  const categories = getCategories(categoriesData, valueType);
  const defaultValues = getDefaultValues(categories, valueType);
  const formSchema = getFormSchema(categories, valueType);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleCancel = () => {
    console.log("handle cancel", id, title);
    // onSubmit(DATA_INITIAL_VALUES.colors);
    replace(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      console.log(values);
      onSubmit(values);
    },
    [onSubmit],
  );

  if (!valueType) return null;

  return (
    <>
      <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={data} id={id} />
        <StepDescription />

        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset className="grid grid-cols-2 gap-6">
              {/* {valueType === "number" && <DynamicForm form={form} />} */}
              {valueType === "resource" ||
                (valueType === "text" &&
                  categories?.map((category) => (
                    <>
                      <FormField
                        control={form.control}
                        name="minValue"
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
                    </>
                  )))}

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
