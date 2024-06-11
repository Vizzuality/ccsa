"use client";

import { useRef, useImperativeHandle, useCallback } from "react";

import { useAtom } from "jotai";
import { datasetFormStepAtom } from "@/app/store";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { isEmpty } from "lodash-es";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";

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
import { usePostDatasets } from "@/types/generated/dataset";
import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import { useGetCategories } from "@/types/generated/category";

export default function NewDatasetSettingsForm({ data, onClick }) {
  const [currentStep, setStep] = useAtom(datasetFormStepAtom);
  const { data: session } = useSession();
  const user = session?.user;

  const { data: categoriesData, isLoading } = useGetCategories(GET_CATEGORIES_OPTIONS(), {
    query: {
      keepPreviousData: true,
    },
  });

  const categoriesList = categoriesData?.data?.map(({ attributes }) => attributes?.name);
  const categoriesOptions = categoriesList?.map((category) => ({
    label: category,
    value: category,
  }));

  const valueTypes = ["text", "number", "boolean", "resource"];
  const valueTypesOptions = valueTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    valueType: z.enum(valueTypes, { message: "Please select one type of value" }),
    category: z.enum(categoriesList, { message: "Please select one category from the list" }),
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
      valueType: "",
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
    onClick({ ...data, settings: { ...values } });
    // mutateDatasets({ data: values });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  const handleStep = useCallback(() => {
    formRef.current?.submitForm();
    console.log(form.formState.isValid);
    if (form.formState.isValid) {
      setStep(2);
    }
  }, [setStep, form.formState.isValid]);

  console.log(data);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 ">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Cancel
          </Button>
          {(isEmpty(data.settings) || isEmpty(data.data) || isEmpty(data.colors)) && (
            <Button size="sm" onClick={handleStep}>
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
      <section className="flex grow flex-col items-center justify-center">
        <div className="space-y-10 py-10">
          <NewDatasetNavigation enableNavigation data={data} />
          <StepDescription />

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset className="w-full max-w-5xl sm:grid sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[260px] space-y-1.5">
                      <FormLabel className="text-xs">Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                    <FormItem className="w-[260px] space-y-1.5">
                      <FormLabel className="text-xs">Type of value</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select one" />
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
                    <FormItem className="w-[260px] space-y-1.5">
                      <FormLabel className="text-xs">Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select one" />
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
                    <FormItem className="w-[260px] space-y-1.5">
                      <FormLabel className="text-xs">Unit</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                          placeholder="unit"
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
                      <FormLabel className="text-xs">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                          placeholder="Add a description"
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
        </div>
      </section>
    </>
  );
}
