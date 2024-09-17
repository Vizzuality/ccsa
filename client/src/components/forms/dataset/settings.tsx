"use client";

import { useCallback } from "react";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { useRouter, useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { isEmpty } from "@/lib/utils/objects";

import { useGetCategories } from "@/types/generated/category";
import {
  CategoryResponse,
  UsersPermissionsRole,
  UsersPermissionsUser,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { datasetStepAtom, useSyncSearchParams, INITIAL_DATASET_VALUES } from "@/app/store";

import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import { Data, VALUE_TYPE } from "@/components/forms/dataset/types";
import DashboardFormControls from "@/components/new-dataset/form-controls";
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

import { VALUE_TYPE_DICTIONARY } from "./constants";
import DashboardFormWrapper from "./wrapper";
import { useDeleteDatasetsId } from "@/types/generated/dataset";
import { useDeleteDatasetEditSuggestionsId } from "@/types/generated/dataset-edit-suggestion";

export default function DatasetSettingsForm({
  title,
  id,
  header = true,
  data: rawData,
  changes,
  onSubmit,
  status,
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  changes?: string[];
  onSubmit: (data: Data["settings"]) => void;
  status?: "approved" | "pending" | "declined" | undefined;
}) {
  const setStep = useSetAtom(datasetStepAtom);
  const data = rawData.settings;
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const isDatasetNew = isEmpty(data);

  const params = useParams();
  const { id: datasetId } = params;

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS(), {
    query: {
      select: (data) =>
        data?.data?.map((data) => ({
          label: data.attributes?.name as string,
          value: data.id as number,
        })),
    },
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

  const value_types = ["text", "number", "boolean", "resource"] as const;
  const valueTypesOptions = value_types.map((type) => ({
    label: VALUE_TYPE_DICTIONARY[type],
    value: type,
  }));

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter dataset name" }),
    value_type: z
      .enum(value_types)
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

  // Type Guard to Check if Category is CategoryResponse
  const isCategoryResponse = (
    category: number | CategoryResponse,
  ): category is CategoryResponse => {
    return (category as CategoryResponse).data !== undefined;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    values: {
      name: data.name,
      value_type: data.value_type as VALUE_TYPE,

      category:
        data?.category && isCategoryResponse(data?.category)
          ? (data?.category?.data?.id as number)
          : (data.category as number),

      unit: data.unit,
      description: data.description,
    },
  });

  const handleCancel = () => {
    onSubmit(INITIAL_DATASET_VALUES.settings);
    setStep(1);
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      const categoryId =
        typeof data.category === "number" ? data.category : data?.category?.data?.id;
      onSubmit({
        ...values,
        category: categoryId || values.category,
      });
    },
    [onSubmit, data],
  );
  console.info({ data, rawData }, "settings");
  const handleDelete = useCallback(() => {
    if (isDatasetNew) {
      mutateDeleteDatasetEditSuggestionsId({ id: +datasetId });
    } else {
      mutateDeleteDatasetsId({ id: +datasetId });
    }
  }, [mutateDeleteDatasetsId, datasetId]);

  return (
    <>
      {header && (
        <DashboardFormControls
          id={id}
          title={title}
          isNew={isDatasetNew}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          status={data.review_status}
        />
      )}
      <DashboardFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} form={form} />}
        {header && <StepDescription />}

        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset className="w-full max-w-5xl gap-4 sm:grid sm:grid-cols-2 md:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">
                      Name<sup className="pl-0.5">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        placeholder="Name"
                        disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value_type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">
                      Type of value<sup className="pl-0.5">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          })}
                          disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
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
                    <FormLabel className="text-xs font-semibold">
                      Category<sup className="pl-0.5">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(+v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          })}
                          disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
                        >
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData?.map(({ label, value }) => (
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
                            "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          })}
                          placeholder="unit"
                          disabled={status === "declined" && ME_DATA?.role?.type !== "admin"}
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
                    <FormLabel className="text-xs font-semibold">
                      Description<sup className="pl-0.5">*</sup>
                    </FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        {...field}
                        data-color-mode="light"
                        preview="edit"
                        value={field.value}
                        placeholder="Add a description"
                        className={cn({
                          "w-full": true,
                          "border-2 border-green-400": changes?.includes(field.name),
                          "cursor-not-allowed":
                            ME_DATA?.role?.type === "authenticated" && status === "declined",
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
      </DashboardFormWrapper>
    </>
  );
}
