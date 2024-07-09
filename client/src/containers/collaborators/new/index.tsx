"use client";
import { useCallback } from "react";

import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { usePostCollaborators, useGetCollaboratorsId } from "@/types/generated/collaborator";
import {
  useGetCollaboratorEditSuggestionsId,
  usePutCollaboratorEditSuggestionsId,
  usePostCollaboratorEditSuggestions,
} from "@/types/generated/collaborator-edit-suggestion";
import {
  UsersPermissionsRole,
  UsersPermissionsUser,
  CollaboratorEditSuggestionCollaboratorDataAttributesType,
} from "@/types/generated/strapi.schemas";
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

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export default function NewCollaboratorForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

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
    // {
    //   query: {
    //     enabled: !!id,
    //   },
    // },
  );

  const { data: collaboratorSuggestedDataId } = useGetCollaboratorEditSuggestionsId(
    +id,
    {},
    // {
    //   query: {
    //     enabled: !!id,
    //   },
    // },
  );

  const previousData =
    collaboratorData?.data?.attributes || collaboratorSuggestedDataId?.data?.attributes;

  const { mutate: mutatePostCollaboratorsTools } = usePostCollaborators({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a new tool:", data);
        push(`/dashboard`);
      },
      onError: (error: Error) => {
        console.error("Error creating a new tool:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePutCollaboratorsEditSuggestionId } = usePutCollaboratorEditSuggestionsId({
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

  const relationTypes = ["collaborator", "donor"] as const;

  const formSchema = z.object({
    name: z.string().refine((val) => !!val, {
      message: "Please enter organization name",
    }),
    relationship: z
      .enum(relationTypes)
      .optional()
      .refine((val) => !!val, {
        message: "Please select a relation type",
      }),
    link: z.string().url({ message: "Please enter a valid URL" }),
    logo: z
      .any()
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`;
      })
      .refine((file) => {
        return (
          ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        );
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: previousData?.name || "",
      relationship: previousData?.type || undefined,
      link: previousData?.link || "",
      logo: null,
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id && !!collaboratorSuggestedDataId) {
          mutatePutCollaboratorsEditSuggestionId({
            id: +id,
            data: {
              data: {
                // TO DO
                // collaborator: { connect: [{ id: +id }] },
                review_status: "pending",
                ...values,
              },
            },
          });
        } else {
          mutatePostCollaboratorsEditSuggestion({
            data: {
              data: {
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
              name: values.name,
              type: values.relationship as CollaboratorEditSuggestionCollaboratorDataAttributesType,
            },
          },
        });
        push(`/collaborators`);
      }
    },
    [
      ME_DATA?.role?.type,
      id,
      collaboratorSuggestedDataId,
      mutatePutCollaboratorsEditSuggestionId,
      mutatePostCollaboratorsEditSuggestion,
      mutatePostCollaboratorsTools,
      push,
    ],
  );

  const handleReject = () => {
    if (ME_DATA?.role?.type === "admin" && collaboratorSuggestedDataId?.data?.id) {
      mutatePutCollaboratorsEditSuggestionId({
        id: collaboratorSuggestedDataId?.data?.id,
        data: {
          data: {
            review_status: "declined",
          },
        },
      });
    }
  };

  const { getInputProps, getRootProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
  });

  const changes =
    !collaboratorData?.data?.attributes && !!id && collaboratorSuggestedDataId?.data?.attributes
      ? []
      : getObjectDifferences(collaboratorData?.data?.attributes, form.getValues());

  return (
    <>
      <DashboardFormControls
        id="collaborators-create"
        title="New collaborator"
        isNew={!id}
        cancelVariant={ME_DATA?.role?.type === "admin" && !!id ? "reject" : "cancel"}
        handleReject={handleReject}
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
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Organization name</FormLabel>
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
                name="relationship"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of relationship</FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.name),
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
                name="logo"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Logo image</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn({
                          "m-auto !flex w-full flex-col space-y-6 rounded-md border border-dashed border-gray-300 py-6 text-xs placeholder:text-gray-300/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50":
                            true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                      >
                        <input type="file" {...getInputProps()} value={field.value} />
                        <Image
                          priority
                          alt="file"
                          width={58}
                          height={58}
                          src="/images/image-file.png"
                          className="m-auto flex"
                        />

                        {!acceptedFiles.length && (
                          <div className="flex flex-col space-y-2 text-center">
                            <p className="font-semibold">
                              Drag and drop here, or <span className="text-primary">browse</span>
                            </p>
                            <p className="font-light">Supports: PNG, JPG, JPEG, GIF, WEBP</p>
                          </div>
                        )}
                        {!!acceptedFiles.length && (
                          <div className="flex flex-col space-y-2 text-center">
                            <p className="font-light">{acceptedFiles[0]?.name}</p>
                          </div>
                        )}
                      </div>
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