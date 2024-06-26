"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import { useGetCategories } from "@/types/generated/category";

import { useSyncSearchParams } from "@/app/store";

import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import { Data } from "@/components/forms/new-dataset/types";
import NewDatasetFormControls from "@/components/new-dataset/form-controls";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MarkdownEditor from "@/components/ui/markdown-editor";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// import { usePostDatasets } from "@/types/generated/dataset";

import NewDatasetDataFormWrapper from "./wrapper";

export default function NewDatasetSettingsForm({
  title,
  id,
  header = true,
  data: rawData,
  changes,
  onSubmit,
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  changes?: string[];
  onSubmit: (data: Data["settings"]) => void;
}) {
  const data = rawData.settings;
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS());

  const categoriesOptions = categoriesData?.data?.map((c) => ({
    label: c.attributes?.name || "",
    value: c.id || 0,
  }));

  const valueTypes = ["text", "number", "boolean", "resource"] as const;
  const valueTypesOptions = valueTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    valueType: z
      .enum(valueTypes)
      .optional()
      .refine((val) => !!val, {
        message: "Please select a value type",
      }),
    category: z
      .number()
      .optional()
      .refine((val) => typeof val !== "undefined", {
        message: "Please select a category",
      }),
    unit: z
      .string()
      .refine((val) => val === "" || (val && typeof val === "string"), {
        message: "Please enter a valid unit",
      })
      .optional(),
    description: z.string().min(6, {
      message: "Please enter a description with at least 6 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: data.name,
      valueType: data.valueType,
      category: data.category,
      unit: data.unit,
      description: data.description,
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <>
      {header && <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />}
      <NewDatasetDataFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} />}
        {header && <StepDescription />}

        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset className="w-full max-w-5xl gap-4 sm:grid sm:grid-cols-2 md:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valueType"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of value</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes("value_type"),
                          })}
                        >
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {valueTypesOptions?.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Category</FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(+v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes("value_type"),
                          })}
                        >
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesOptions?.map(({ label, value }) => (
                            <SelectItem key={value} value={`${value}`}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="inline-flex w-full items-center justify-between text-xs">
                      <span className="block font-semibold">Unit</span>
                      <span className="block text-gray-500">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <>
                        <Input
                          {...field}
                          value={field.value}
                          className={cn({
                            "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                            "bg-green-400": changes?.includes(field.name),
                          })}
                          placeholder="unit"
                        />
                        <p className="text-xs">This will appear in the legend (e.g. dollars)</p>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2 space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Description</FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        {...field}
                        data-color-mode="light"
                        preview="edit"
                        value={field.value}
                        placeholder="Add a description"
                        className={cn({
                          "w-full": true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
