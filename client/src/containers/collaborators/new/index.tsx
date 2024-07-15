"use client";
import { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useGetCollaboratorsId } from "@/types/generated/collaborator";
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

import { updateOrCreateCollaborator } from "@/services/collaborators";
import { uploadImage } from "@/services/datasets";

export default function NewCollaboratorForm() {
  const [imageId, setImageId] = useState<number>(null);
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
  // an existing one
  const { data: collaboratorData } = useGetCollaboratorsId(
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

  const { data: collaboratorSuggestedDataId } = useGetCollaboratorEditSuggestionsId(
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

  const previousData =
    collaboratorData?.data?.attributes || collaboratorSuggestedDataId?.data?.attributes;

  const { mutate: mutatePutCollaboratorsEditSuggestionId } = usePutCollaboratorEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating a new collaborator:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error updating a new collaborator:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePostCollaboratorsEditSuggestion } = usePostCollaboratorEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a new collaborator:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating a new collaborator:", error);
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
    type: z
      .enum(relationTypes)
      .optional()
      .refine((val) => !!val, {
        message: "Please select a relation type",
      }),
    link: z.string().url({ message: "Please enter a valid URL" }),
    image: z.number().min(1, { message: "Please ass image" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: previousData?.name || "",
      type: (previousData?.type as CollaboratorEditSuggestionCollaboratorDataAttributesType) || "",
      link: previousData?.link || "",
      image: previousData?.image?.data?.id as number,
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
                review_status: "pending",
                ...values,
                image: imageId,
              },
            },
          });
        }
        if ((!!id && !collaboratorSuggestedDataId) || !id) {
          // is an edition to an existing one, has there is a suggestion
          // we have to post to a new one
          // no need to send author because BE handles it
          mutatePostCollaboratorsEditSuggestion({
            data: {
              data: {
                review_status: "pending",
                ...values,
                image: imageId,
                // @ts-expect-error TO-DO - fix types
                collaborator: {
                  connect: [+id],
                  disconnect: [],
                },
              },
            },
          });
        }
      }

      if (ME_DATA?.role?.type === "admin" && data?.apiToken) {
        updateOrCreateCollaborator(
          {
            ...(id && !collaboratorSuggestedDataId && { id }),
            ...(id &&
              !!collaboratorSuggestedDataId && {
                id: collaboratorSuggestedDataId?.data?.attributes?.collaborator?.data?.id,
              }),
            ...values,
            image: imageId,
          },
          data?.apiToken,
        )
          .then((data) => {
            console.info("Success creating collaborator:", data);
            toast.success("Success creating collaborator");

            mutatePostCollaboratorsEditSuggestion({
              data: {
                data: {
                  review_status: "approved",
                  ...values,
                  image: imageId,
                  // @ts-expect-error TO-DO - fix types
                  collaborator: {
                    connect: [+id],
                    disconnect: [],
                  },
                },
              },
            });
            push(`/collaborators`);
          })
          .catch((error: Error) => {
            toast.error("There was a problem creating the collaborator");
            console.error("Error creating collaborator:", error);
          });
      }
    },
    [
      data?.apiToken,
      push,
      ME_DATA?.role?.type,
      id,
      collaboratorSuggestedDataId,
      mutatePutCollaboratorsEditSuggestionId,
      mutatePostCollaboratorsEditSuggestion,
      imageId,
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
    maxFiles: 1,
    maxSize: 500000,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp", "./svgs"] },
    onDropAccepted(files) {
      if (files.length > 0) {
        uploadImage(files, {
          Authorization: `Bearer ${data?.apiToken}`,
        }).then((data) => {
          form.setValue("image", data[0].id);
          setImageId(data[0].id);
        });
      }
    },
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
                name="type"
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
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Logo image</FormLabel>

                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn({
                          "center cover m-auto !flex h-48 w-full flex-col space-y-6 rounded-md border border-dashed border-gray-300 bg-opacity-10 bg-cover py-6 text-xs placeholder:text-gray-300/95 hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50":
                            true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                        style={{
                          // env.NEXT_PUBLIC_CMS_URL
                          backgroundImage: `url(http://0.0.0.0:1337${previousData?.image?.data?.attributes?.url})`,
                        }}
                      >
                        <input type="file" {...getInputProps()} />

                        <Image
                          priority
                          alt="file"
                          width={58}
                          height={58}
                          src="/images/image-file.png"
                          className="m-auto flex"
                        />
                        {!previousData?.image?.data?.attributes?.url && (
                          <div className="flex flex-col space-y-2 text-center">
                            <p className="font-semibold">
                              Drag and drop here, or <span className="text-primary">browse</span>
                            </p>
                            <p className="font-light">Supports: PNG, JPG, JPEG, GIF, WEBP</p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!!acceptedFiles.length && (
                <div className="flex flex-col space-y-2 text-center">
                  <button className="text-xs">{acceptedFiles[0]?.name}</button>
                </div>
              )}
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
