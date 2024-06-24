"use client";

import { useMemo, useRef, useImperativeHandle } from "react";

import { useForm } from "react-hook-form";

import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, uniq, compact } from "lodash-es";
import { z } from "zod";

import type { Data } from "@/containers/datasets/new";

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

import { VALUE_TYPE } from "./types";
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

const getCategories = (valueType: VALUE_TYPE, data: Data): string[] => {
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

const getDefaultValues = (valueType: VALUE_TYPE, categories: string[]): Record<string, any> => {
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
        {} as Record<string, string>,
      );
    default:
      return {};
  }
};

export default function NewDatasetColorsForm({
  data,
  onClick,
}: {
  data: Data;
  onClick: (data: Data) => void;
}) {
  const categories = getCategories(data.settings.value_type, data);
  const valueType = data.settings.value_type;
  const formSchema = getFormSchema(valueType, categories);
  const defaultValues = getDefaultValues(valueType, categories);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onClick({ ...data, data: { ...values } });
    // mutateDatasets({ data: values });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  if (valueType === "resource") {
    console.log("resource");
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4 sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Cancel
          </Button>
          {isEmpty(data.colors) && (
            <Button size="sm" onClick={() => formRef.current?.submitForm()}>
              Continue
            </Button>
          )}
          {!isEmpty(data.settings) && !isEmpty(data.data) && !isEmpty(data.colors) && (
            <Button size="sm" onClick={() => formRef.current?.submitForm()}>
              Submit
            </Button>
          )}
        </div>
      </div>
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={data} form={form} />
        <StepDescription />

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
