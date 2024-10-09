"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useDeleteOtherToolsId, useGetOtherToolsId } from "@/types/generated/other-tool";
import { useGetOtherToolsCategories } from "@/types/generated/other-tools-category";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import {
  useGetToolEditSuggestionsId,
  usePostToolEditSuggestions,
  usePutToolEditSuggestionsId,
  useDeleteToolEditSuggestionsId,
} from "@/types/generated/tool-edit-suggestion";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";
import CSVImport from "@/components/new-dataset/step-description/csv-import";
import { GET_CATEGORIES_OPTIONS } from "@/constants/datasets";

import DashboardFormWrapper from "@/components/forms/dataset/wrapper";
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

export default function ToolForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const params = useParams();

  const { id } = params;

  const { data: categoriesData } = useGetOtherToolsCategories(GET_CATEGORIES_OPTIONS(), {
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

  const { mutate: mutatePostToolEditSuggestion } = usePostToolEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        if (ME_DATA?.role?.type === "authenticated") {
          console.info("Success creating a new tool suggestion:", data);
          toast.success("Success creating a new tool suggestion");
          push(`/dashboard`);
        }
      },
      onError: (error) => {
        console.error("Error creating a new tool:", error);
      },
    },
    request: {},
  });

  const { mutate: mutateDeleteOtherToolsId } = useDeleteOtherToolsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success deleting the tool:", data);
        toast.success("Success deleting the tool");
        push(`/other-tools`);
      },
      onError: (error: Error) => {
        console.error("Error deleting the tool:", error);
      },
    },
  });

  const { mutate: mutateDeleteToolSuggestionsId } = useDeleteToolEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success deleting the suggested tool:", data);
        toast.success("Success deleting the suggested tool");
        push(`/other-tools`);
      },
      onError: (error: Error) => {},
    },
  });

  const { mutate: mutatePutToolEditSuggestionId } = usePutToolEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating the tool suggestion:", data);
        toast.success("Success updating the tool suggestion");
        if (
          ME_DATA?.role?.type === "authenticated" ||
          data?.data?.attributes?.review_status === "declined" ||
          data?.data?.attributes?.review_status === "pending"
        ) {
          push(`/dashboard`);
        }
        push(`/other-tools`);
      },
      onError: (error: Error) => {
        console.error("Error updating the tool suggestion:", error);
        console.error("Error updating the tool suggestion", error);
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
      category: previousData?.other_tools_category?.data?.id as number,
      description: previousData?.description || "",
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id && !!editSuggestionIdData) {
          mutatePutToolEditSuggestionId({
            id: +id[0],
            data: {
              // @ts-expect-error TO-DO - fix types
              data: {
                review_status: "pending",
                ...values,
                ...(values?.category && {
                  other_tools_category: {
                    disconnect: [],
                    connect: [+values?.category],
                  },
                }),
              },
            },
          });
        }
        if ((!!id && !editSuggestionIdData) || !id) {
          mutatePostToolEditSuggestion({
            data: {
              // @ts-expect-error TO-DO - fix types
              data: {
                review_status: "pending",
                ...values,
                ...(values?.category && {
                  other_tools_category: {
                    disconnect: [],
                    connect: [+values?.category],
                  },
                }),
                ...(id && {
                  other_tool: {
                    disconnect: [+id],
                    connect: [+id],
                  },
                }),
              },
            },
          });
        }
      }

      // TO - DO
      if (ME_DATA?.role?.type === "admin") {
        if (data?.apiToken) {
          updateOrCreateOtherTools(
            {
              ...(id && !editSuggestionIdData && { id }),
              ...(id &&
                !!editSuggestionIdData && {
                  id: editSuggestionIdData?.data?.attributes?.other_tool?.data?.id,
                }),
              ...values,
              other_tools_category: values.category,
              reviewed_by: {
                connect: [ME_DATA.id],
                disconnect: [],
              },
            },
            data?.apiToken,
          )
            .then(() => {
              if (!id) {
                console.info("Success creating the tool");
                toast.success("Success creating the tool");
              }

              if (!!id && !editSuggestionIdData) {
                console.info("Success updating the tool");
                toast.success("Success updating the tool");
                mutatePostToolEditSuggestion({
                  data: {
                    // @ts-expect-error TO-DO - fix types
                    data: {
                      review_status: "approved",
                      ...values,
                      ...(values?.category && {
                        category: {
                          disconnect: [],
                          connect: [+values?.category],
                        },
                      }),
                      ...(values?.category && {
                        category: {
                          disconnect: [],
                          connect: [+values?.category],
                        },
                      }),
                      ...(id && {
                        other_tool: {
                          disconnect: [+id],
                          connect: [+id],
                        },
                      }),
                      ...(ME_DATA.id && {
                        reviewed_by: {
                          connect: [ME_DATA.id],
                          disconnect: [],
                        },
                      }),
                    },
                  },
                });
              }
              push(`/other-tools`);
            })
            .catch((error: Error) => {
              toast.error("There was a problem creating the tool");
              console.error("Error creating the tool:", error);
            });
        }
      }
    },
    [
      mutatePostToolEditSuggestion,
      ME_DATA,
      id,
      mutatePutToolEditSuggestionId,
      data?.apiToken,
      push,
      editSuggestionIdData,
    ],
  );

  const handleReject = ({ message }: { message?: string }) => {
    if (ME_DATA?.role?.type === "admin" && editSuggestionIdData?.data?.id) {
      mutatePutToolEditSuggestionId({
        id: editSuggestionIdData?.data?.id,
        data: {
          data: {
            review_status: "declined",
            review_decision_details: message,
          },
        },
      });
    }
  };

  const handleDelete = useCallback(() => {
    if (otherToolData?.data?.id) {
      mutateDeleteOtherToolsId({ id: +id });
    } else if (editSuggestionIdData?.data?.id) {
      mutateDeleteToolSuggestionsId({ id: editSuggestionIdData?.data?.id });
    }
  }, [mutateDeleteOtherToolsId, id]);

  const suggestionStatus = editSuggestionIdData?.data?.attributes?.review_status;

  return (
    <>
      <DashboardFormControls
        isNew={!id}
        title={!id ? "New tool" : "Edit tool"}
        id="other-tool-create"
        handleReject={handleReject}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        status={editSuggestionIdData?.data?.attributes?.review_status}
        message={editSuggestionIdData?.data?.attributes?.review_decision_details}
      />
      <div className="py-10 sm:px-10 md:px-24 lg:px-32">
        <CSVImport
          valueType="other-tools"
          values={{
            data: {
              name: "",
              link: "",
              category: "",
              description: "",
            },
          }}
        />
      </div>
      <DashboardFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p>
          Fill the tool&apos;s information{" "}
          <span className="text-sm font-light">
            (<sup>*</sup>required fields)
          </span>
        </p>
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
                    <FormLabel className="text-xs font-semibold">
                      Tool name<sup className="pl-0.5">*</sup>
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
                        disabled={
                          ME_DATA?.role?.type === "authenticated" && suggestionStatus === "declined"
                        }
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
                    <FormLabel className="text-xs font-semibold">
                      Website link<sup className="pl-0.5">*</sup>
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
                        disabled={
                          ME_DATA?.role?.type === "authenticated" && suggestionStatus === "declined"
                        }
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
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          "cursor-not-allowed":
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined",
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
                    <FormLabel className="text-xs font-semibold">
                      Category<sup className="pl-0.5">*</sup>
                    </FormLabel>
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
                        disabled={
                          ME_DATA?.role?.type === "authenticated" && suggestionStatus === "declined"
                        }
                      >
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          })}
                          disabled={
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined"
                          }
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
      </DashboardFormWrapper>
    </>
  );
}
