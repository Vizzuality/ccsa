"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import { usePostCollaborators, useGetCollaboratorsId } from "@/types/generated/collaborator";
import {
  useGetCollaboratorEditSuggestionsId,
  usePutCollaboratorEditSuggestionsId,
  usePostCollaboratorEditSuggestions,
} from "@/types/generated/collaborator-edit-suggestion";
import { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";

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

  const { data } = useSession();
  const user = data?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // if there is no id in the route, we are creating a new collaborator, no need to look for
  // an existing tool
  const { data: collaboratorData } = useGetCollaboratorsId(
    +id,
    {},
    {
      query: {
        enabled: !!id,
      },
    },
  );

  const { mutate: mutatePostCollaboratorsTools } = usePostCollaborators({
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

  const { mutate: mutatePutCollaboratorsEditSuggestion } = usePutCollaboratorEditSuggestionsId({
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

  const { mutate: mutatePostCollaboratorsEditSuggestion } = usePostCollaboratorEditSuggestions({
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

  const { mutate: mutateCollaboratorEditSuggestion } = usePostCollaboratorEditSuggestions({
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

  const relationshipOptions = [
    {
      label: "Collaborator",
      value: "collaborator",
    },
    {
      label: "Donor",
      value: "donor",
    },
  ];

  const formSchema = z.object({
    organization: z.string().refine((val) => !!val, {
      message: "Please enter a valid link",
    }),
    relationship: z
      .string()
      .optional()
      .refine((val) => typeof val !== "undefined", {
        message: "Please select relationship",
      }),

    link: z.string().url({ message: "Please enter a valid URL" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      organization: collaboratorData?.data?.attributes?.name || "",
      relationship: collaboratorData?.data?.attributes?.type || "",
      link: collaboratorData?.data?.attributes?.link || "",
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id) {
          mutatePutCollaboratorsEditSuggestion({
            id: +id,
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
              },
            },
          });
        } else {
          mutatePostCollaboratorsEditSuggestion({
            data: {
              data: {
                author: user?.id,
                review_status: "pending",
                ...values,
              },
            },
          });
        }
      }

      if (ME_DATA?.role?.type === "admin") {
        mutatePostCollaboratorsTools({
          data: {
            data: {
              link: values.link,
              name: values.organization,
              type: values.relationship,
            },
          },
        });
      }
      push(`/dashboard`);
    },
    [
      mutatePutCollaboratorsEditSuggestion,
      mutatePostCollaboratorsTools,
      mutatePostCollaboratorsEditSuggestion,
      push,
      id,
      ME_DATA,
      user?.id,
    ],
  );

  return (
    <>
      <DashboardFormControls
        title="New collaborator"
        id="collaborators-create"
        handleCancel={handleCancel}
      />
      <NewDatasetDataFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p>Fill the organization&apos;s information</p>
        <Form {...form}>
          <form
            id="collaborators-create"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset className=" space-y-6">
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Organization name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.organization),
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
                name="relationship"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of relationship</FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(+v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.relationship),
                          })}
                        >
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions?.map(({ label, value }) => (
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
                name="logo"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Logo image</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.logo),
                        })}
                        placeholder="Name"
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
