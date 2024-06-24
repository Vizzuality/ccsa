"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetCategories } from "@/types/generated/category";

import { useSyncSearchParams } from "@/app/store";

import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import { DATA_INITIAL_VALUES } from "@/containers/datasets/new";
import type { Data } from "@/containers/datasets/new";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// import { usePostDatasets } from "@/types/generated/dataset";

import NewDatasetDataFormWrapper from "./wrapper";

export default function NewDatasetSettingsForm({
  data,
  onSubmit,
}: {
  data: Data["settings"];
  onSubmit: (data: Data["settings"]) => void;
}) {
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS(), {
    query: {
      keepPreviousData: true,
    },
  });

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
    valueType: z.enum(valueTypes),
    category: z.number(),
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
    defaultValues: {
      name: data.name,
      valueType: data.valueType,
      category: data.category,
      unit: data.unit,
      description: data.description,
    },
  });

  const handleCancel = () => {
    onSubmit(DATA_INITIAL_VALUES.settings);
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

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4 sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button form="dataset-settings" size="sm" type="submit">
            Continue
          </Button>
        </div>
      </div>
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={data} form={form} />
        <StepDescription />

        <Form {...form}>
          <form
            id="dataset-settings"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={data.name || "Name"}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder={"Select one"} />
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
                      <Select onValueChange={(v) => field.onChange(+v)} value={`${field.value}`}>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder={"Select one"} />
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
                    <FormLabel className="flex justify-between text-xs">
                      <span className="font-semibold">Unit</span>
                      <span className="text-gray-500">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={data.unit || "unit"}
                      />
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
                      <Textarea
                        {...field}
                        value={field.value}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={"Add a description"}
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
