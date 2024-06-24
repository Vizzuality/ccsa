"use client";

import { useRef, useImperativeHandle, useCallback } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { compareData } from "@/lib/utils/objects";

import { useGetCategories } from "@/types/generated/category";

import { datasetFormStepAtom } from "@/app/store";
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
  onClick,
}: {
  data: Data;
  onClick: (data: Data) => void;
}) {
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();
  const [, setStep] = useAtom(datasetFormStepAtom);
  const { data: session } = useSession();
  const user = session?.user;

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS(), {
    query: {
      keepPreviousData: true,
    },
  });

  const categoriesList = categoriesData?.data?.map(({ attributes }) => attributes?.name);
  const categoriesOptions = categoriesList?.map((category) => ({
    label: category,
    value: category,
  }));

  const valueTypes = ["text", "number", "boolean", "resource"] as const;
  const valueTypesOptions = valueTypes.map((type) => ({
    label: type,
    value: type,
  }));

  if (categoriesList?.length === 0) {
    throw new Error("categoriesList cannot be empty");
  }

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    valueType: z.enum(valueTypes),
    category: z.enum(categoriesList),
    unit: z
      .string()
      .refine((val) => val === "" || (val && typeof val === "string"), {
        message: "Please enter a valid unit",
      })
      .optional(),
    description: z.string().min(6, {
      message: "Please enter a password with at least 6 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      valueType: undefined,
      category: "",
      unit: "",
    },
  });

  // const { mutate: mutateDatasets } = usePostDatasets({
  //   mutation: {
  //     onSuccess: (data) => {
  //       queryClient.invalidateQueries(["/datasets"]);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },
  //   request: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${user?.apiToken}`,
  //     },
  //   },
  // });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onClick({ ...data, settings: { ...data.settings, ...values } });
    // mutateDatasets({ data: values });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  const handleScreen = useCallback(async () => {
    const areEqualValues = compareData(form.getValues(), data.settings);
    if (isEmpty(data.settings)) {
      await form.handleSubmit(onSubmit)();
      setStep(2);
    }

    if (!areEqualValues && !isEmpty(data.settings)) {
      const currentValues = form.getValues();
      const fieldsToUpdate = form.formState.dirtyFields;

      Object.keys(currentValues).forEach((key) => {
        if (fieldsToUpdate[key]) {
          form.setValue(key, currentValues[key]);
        } else {
          form.setValue(key, data.settings[key]);
        }
      });
      await form.handleSubmit(onSubmit)();
      setStep(2);
    }

    if (form.formState.isValid && isEmpty(data.settings)) {
      await form.handleSubmit(onSubmit)();
      setStep(2);
    }
  }, [setStep, form, data.settings]);

  const handleCancel = () => {
    onClick(DATA_INITIAL_VALUES);
    replace(`/?${URLParams.toString()}`);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4 sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline" onClick={handleCancel}>
            Cancel
          </Button>
          {isEmpty(data.settings) || isEmpty(data.data) || isEmpty(data.colors) ? (
            <Button size="sm" onClick={handleScreen}>
              Continue
            </Button>
          ) : (
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
                        value={field.value || data.settings.name}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={data.settings.name || "Name"}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || data.settings.value_type}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder={data.settings.value_type || "Select one"} />
                        </SelectTrigger>
                        <SelectContent>
                          {valueTypesOptions?.map(({ label, value }) => (
                            <SelectItem key={value} value={value as string}>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || data.settings.category}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder={data.settings.category || "Select one"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesOptions?.map(({ label, value }) => (
                            <SelectItem key={value} value={value as string}>
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
                        value={field.value || data.settings.unit}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={data.settings.unit || "unit"}
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
                        value={field.value || data.settings.description}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={data.settings.description || "Add a description"}
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
