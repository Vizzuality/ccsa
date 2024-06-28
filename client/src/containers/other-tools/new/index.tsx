"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import { useGetCategories } from "@/types/generated/category";
import { usePostOtherTools } from "@/types/generated/other-tool";
import { useGetOtherToolsId } from "@/types/generated/other-tool";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import {
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

export default function NewToolForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const changes = [];

  const params = useParams();

  const { id } = params;

  const { data: categoriesData } = useGetCategories(GET_CATEGORIES_OPTIONS());

  const { data } = useSession();
  const user = data?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // if there is no id in the route, we are creating a new tool, no need to look for
  // an existing tool
  const {
    data: otherTool,
    isFetched,
    isFetching,
    isError,
  } = useGetOtherToolsId(
    +id,
    {},
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
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating a new tool:", error);
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

  const { mutate: mutatePutToolEditSuggestion } = usePutToolEditSuggestionsId({
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

  const categoriesOptions = categoriesData?.data?.map((c) => ({
    label: c.attributes?.name || "",
    value: c.id || 0,
  }));

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(id && {
      values: {
        name: "data.name",
        link: "data.unit",
        category: 0,
        description: "data.description",
      },
    }),
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id) {
          mutatePutToolEditSuggestion({
            id: +id,
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
              },
            },
          });
        } else
          mutatePostToolEditSuggestion({
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
              },
            },
          });
      }

      if (ME_DATA?.role?.type === "admin") {
        mutatePostOtherTools({
          data: {
            data: values,
          },
        });
      }
      push(`/dashboard`);
    },
    [mutatePostToolEditSuggestion, mutatePostOtherTools, push, ME_DATA, user?.id],
  );

  return (
    <>
      <DashboardFormControls title="New tool" id="other-tool-create" handleCancel={handleCancel} />
      <NewDatasetDataFormWrapper header={true} className="m-auto w-full max-w-sm ">
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
                          "bg-green-400": changes?.includes(field.link),
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
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(+v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.name),
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
