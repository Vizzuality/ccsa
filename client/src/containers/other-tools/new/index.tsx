"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useGetCategories } from "@/types/generated/category";
import {
  usePostOtherTools,
  useGetOtherToolsId,
  usePutOtherToolsId,
} from "@/types/generated/other-tool";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import {
  useGetToolEditSuggestionsId,
  usePostToolEditSuggestions,
  usePutToolEditSuggestionsId,
} from "@/types/generated/tool-edit-suggestion";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";

import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import NewDatasetDataFormWrapper from "@/components/forms/dataset/wrapper";
import DashboardFormControls from "@/components/new-dataset/form-controls";
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

import { updateOrCreateOtherTools } from "@/services/other-tools";

export default function NewToolForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const params = useParams();

  const { id } = params;

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS(), {
    query: {
      select: (data) =>
        data?.data?.map((data) => ({
          label: data.attributes?.name as string,
          value: data.id as number,
        })),
    },
  });
  const { data } = useSession();
  const user = data?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // if there is no id in the route, we are creating a new tool, no need to look for
  // an existing tool
  const { data: otherToolData } = useGetOtherToolsId(
    +id,
    {
      populate: "*",
    },
    {
      query: {
        enabled: !!id,
      },
    },
  );

  const { data: editSuggestionIdData } = useGetToolEditSuggestionsId(
    +id,
    {
      populate: "*",
    },
    {
      query: {
        enabled: !!id,
      },
    },
  );

  const { mutate: mutatePostOtherTools } = usePostOtherTools({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a new tool:", data);
        push(`/other-tools`);
      },
      onError: (error) => {
        console.error("Error creating a new tool:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePutOtherToolsId } = usePutOtherToolsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating the tool:", data);
        push(`/other-tools`);
      },
      onError: (error) => {
        console.error("Error updating the new tool:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePostToolEditSuggestion } = usePostToolEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a new tool:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating a new tool:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePutToolEditSuggestionId } = usePutToolEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating the tool:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error updating the tool:", error);
      },
    },
    request: {},
  });

  const changes =
    !!id && otherToolData?.data?.attributes && editSuggestionIdData?.data?.attributes
      ? getObjectDifferences(
          editSuggestionIdData?.data?.attributes,
          otherToolData?.data?.attributes,
        )
      : [];

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter tool name" }),
    link: z.string().url({ message: "Please enter a valid URL" }),
    category: z
      .number()
      .optional()
      .refine((val) => typeof val !== "undefined", {
        message: "Please select a category",
      }),
    description: z.string().min(6, {
      message: "Please enter a description with at least 6 characters",
    }),
  });

  const previousData = editSuggestionIdData?.data?.attributes || otherToolData?.data?.attributes;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: previousData?.name || "",
      link: previousData?.link || "",
      category: previousData?.other_tools_category?.data?.id || undefined,
      description: previousData?.description || "",
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id) {
          mutatePutToolEditSuggestionId({
            id: +id[0],
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
              },
            },
          });
        }
        if (!!id && !otherToolData) {
          mutatePostToolEditSuggestion({
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
                // @ts-expect-error TO-DO - fix types
                other_tool: {
                  disconnect: [+id],
                  connect: [+id],
                },
              },
            },
          });
        }
      }

      // TO - DO
      if (ME_DATA?.role?.type === "admin") {
        if (!!id && !editSuggestionIdData && values.category) {
          mutatePutOtherToolsId({
            id: +id,
            data: {
              data: {
                ...values,
                // @ts-expect-error TO-DO - fix types
                other_tools_category: {
                  connect: [+values.category],
                  disconnect: [],
                },
              },
            },
          });
        }
        if (!!id && !!editSuggestionIdData && values.category && data?.apiToken) {
          updateOrCreateOtherTools(
            {
              data: {
                ...values,
                other_tools_category: {
                  disconnect: [],
                  connect: values.category,
                },

                dataset_edit_suggestion: {
                  disconnect: [],
                  connect: +id,
                },
              },
            },
            data?.apiToken,
          );
          mutatePutOtherToolsId({
            id: +id,
            data: {
              data: {
                ...values,
                // @ts-expect-error TO-DO - fix types
                other_tools_category: {
                  connect: [+values.category],
                  disconnect: [],
                },
              },
            },
          });
        }
        if (!id) {
          mutatePostOtherTools({
            data: {
              data: {
                ...values,
              },
            },
          });
        }
      }
    },
    [
      mutatePostToolEditSuggestion,
      mutatePostOtherTools,
      mutatePutOtherToolsId,
      ME_DATA,
      user?.id,
      id,
      mutatePutToolEditSuggestionId,
    ],
  );

  const handleReject = () => {
    if (ME_DATA?.role?.type === "admin" && editSuggestionIdData?.data?.id) {
      mutatePutToolEditSuggestionId({
        id: editSuggestionIdData?.data?.id,
        data: {
          data: {
            review_status: "declined",
          },
        },
      });
    }
  };

  return (
    <>
      <DashboardFormControls
        isNew={!id}
        title="New tool"
        id="other-tool-create"
        cancelVariant={ME_DATA?.role?.type === "admin" && !!id ? "reject" : "cancel"}
        handleReject={handleReject}
        handleCancel={handleCancel}
      />
      <NewDatasetDataFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p>Fill the tool&apos;s information</p>
        <Form {...form}>
          <form
            id="other-tool-create"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Tool name</FormLabel>
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
                name="link"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Website link</FormLabel>
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
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Category</FormLabel>
                    <FormControl>
                      <Select
                        value={`${field.value}`}
                        onValueChange={(v) => field.onChange(+v)}
                        defaultValue={
                          categoriesData?.find(
                            (category) =>
                              category.value === previousData?.other_tools_category?.data?.id,
                          )?.label
                        }
                      >
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.name),
                          })}
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
