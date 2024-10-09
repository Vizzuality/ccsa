"use client";
import { useCallback, useState, useRef, useEffect } from "react";

import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import CSVImport from "@/components/new-dataset/step-description/csv-import";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useDeleteCollaboratorsId, useGetCollaboratorsId } from "@/types/generated/collaborator";
import {
  useGetCollaboratorEditSuggestionsId,
  usePutCollaboratorEditSuggestionsId,
  usePostCollaboratorEditSuggestions,
  useDeleteCollaboratorEditSuggestionsId,
} from "@/types/generated/collaborator-edit-suggestion";
import {
  UsersPermissionsRole,
  UsersPermissionsUser,
  CollaboratorEditSuggestionCollaboratorDataAttributesType,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { updateOrCreateCollaborator } from "@/services/collaborators";
import { uploadImage } from "@/services/datasets";

export default function CollaboratorForm() {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    // Detect if the user agent is Chrome only on the client side
    if (typeof window !== "undefined" && navigator.userAgent.includes("Chrome")) {
      setIsChrome(true);
    }
  }, []);
  const [imageId, setImageId] = useState<number | null>(null);
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (
          data?.data?.attributes?.review_status === "declined" ||
          data?.data?.attributes?.review_status === "pending" ||
          ME_DATA?.role?.type === "authenticated"
        ) {
          push(`/dashboard`);
        }
        push(`/collaborators`);
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
        ME_DATA?.role?.type === "authenticated" && push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating a new collaborator:", error);
      },
    },
    request: {},
  });

  const { mutate: mutateDeleteCollaboratorId } = useDeleteCollaboratorsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success deleting collaborator:", data);
        push(`/collaborators`);
      },
      onError: (error) => {
        console.error("Error deleting collaborator:", error);
      },
    },
  });

  const { mutate: mutateDeleteCollaboratorEditSuggestionsId } =
    useDeleteCollaboratorEditSuggestionsId({
      mutation: {
        onSuccess: (data) => {
          console.info("Success deleting collaborator suggestion:", data);
          push(`/collaborators`);
        },
        onError: (error) => {
          console.error("Error deleting collaborator suggestion:", error);
        },
      },
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
    link: z.string().refine(
      (value) => {
        // Allow URLs starting with "www." or valid URLs starting with "http" or "https"
        return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/.test(value);
      },
      { message: "Please enter a valid URL" },
    ),
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
                image: imageId as number,
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
              // @ts-expect-error wrong strapi typing
              data: {
                review_status: "pending",
                ...values,
                image: imageId as number,
                ...(id && {
                  collaborator: {
                    connect: [+id],
                    disconnect: [],
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
            ...(ME_DATA.id && {
              reviewed_by: {
                connect: [ME_DATA.id],
                disconnect: [],
              },
            }),
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
                  image: imageId as number,
                  // @ts-expect-error TO-DO - fix types
                  collaborator: {
                    connect: [+id],
                    disconnect: [],
                  },
                  ...(ME_DATA.id && {
                    reviewed_by: {
                      connect: [ME_DATA.id],
                      disconnect: [],
                    },
                  }),
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

  const handleReject = ({ message }: { message: string }) => {
    if (ME_DATA?.role?.type === "admin" && !!id) {
      mutatePutCollaboratorsEditSuggestionId({
        id: +id[0],
        data: {
          data: {
            review_status: "declined",
            review_decision_details: message,
          },
        },
      });
    }
  };

  const { getInputProps, getRootProps, acceptedFiles } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 50000000,
    accept: { "image/*": [".gif", ".jpeg", ".jpg", ".webp", ".png", ".svgs"] },
    onDropAccepted(files) {
      if (files.length > 0) {
        uploadImage(files, {
          Authorization: `Bearer ${data?.apiToken}`,
        })
          .then((data) => {
            form.setValue("image", data[0].id);
            setImageId(data[0].id);
            toast.success(`Image ${data?.[0].name} uploaded successfully`);
          })
          .catch((error) => {
            console.error("Error uploading image:", error[0]?.message);
            toast.error("Error uploading image");
          });
      }
    },
    onDropRejected(error) {
      console.error("Error uploading image:", error[0]?.errors[0]?.message);
      toast.error("Error uploading image: " + error[0]?.errors[0]?.message);
    },
  });

  const handleDelete = useCallback(() => {
    if (collaboratorData?.data?.id) {
      mutateDeleteCollaboratorId({ id: +id });
    } else if (collaboratorSuggestedDataId?.data?.id) {
      mutateDeleteCollaboratorEditSuggestionsId({ id: +id });
    }
  }, [id, mutateDeleteCollaboratorId]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const changes =
    !collaboratorData?.data?.attributes && !!id && collaboratorSuggestedDataId?.data?.attributes
      ? []
      : getObjectDifferences(collaboratorData?.data?.attributes, form.getValues());

  const suggestionStatus = collaboratorSuggestedDataId?.data?.attributes?.review_status;

  return (
    <>
      <DashboardFormControls
        id="collaborators-create"
        isNew={!id}
        title={!id ? "New collaborator" : "Edit collaborator"}
        handleReject={handleReject}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        status={suggestionStatus}
        message={collaboratorSuggestedDataId?.data?.attributes?.review_decision_details}
      />
      <div className="py-10 sm:px-10 md:px-24 lg:px-32">
        <CSVImport
          valueType="collaborators"
          values={{
            data: {
              name: "",
              type: "",
              link: "",
            },
          }}
        />
      </div>
      <DashboardFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p>
          Fill the organization&apos;s information{" "}
          <span className="text-sm font-light">
            (<sup>*</sup>required fields)
          </span>
        </p>
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
                    <FormLabel className="text-xs font-semibold">
                      Organization name<sup className="pl-0.5">*</sup>
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
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">
                      Type of relationship<sup className="pl-0.5">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(v)}>
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
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">
                      Logo image<sup className="pl-0.5">*</sup>
                    </FormLabel>

                    <FormControl>
                      <div
                        {...getRootProps()}
                        className={cn({
                          "center cover m-auto !flex h-48 w-full flex-col space-y-6 rounded-md border border-dashed border-gray-300 bg-opacity-10 bg-cover py-6 text-xs placeholder:text-gray-300/95 hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50":
                            true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        style={{
                          // env.NEXT_PUBLIC_API_URL
                          backgroundImage: `url(${previousData?.image?.data?.attributes?.url})`,
                        }}
                      >
                        <input
                          {...getInputProps()}
                          ref={fileInputRef}
                          type="file"
                          disabled={
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined"
                          }
                          className="h-full w-full cursor-pointer"
                          accept="image/*;capture=camera"
                        />

                        <Image
                          priority
                          alt="file"
                          width={58}
                          height={58}
                          src="/images/image-file.png"
                          className="m-auto flex"
                        />
                        {!previousData?.image?.data?.attributes?.url && !isChrome && (
                          <div className="flex flex-col space-y-2 text-center font-semibold">
                            <div>
                              Drag and drop here, or{" "}
                              <button type="button" className="text-primary" onClick={handleClick}>
                                browse
                              </button>
                            </div>
                            <p className="font-light">Supports: PNG, JPG, JPEG, GIF, WEBP</p>
                          </div>
                        )}
                        {!previousData?.image?.data?.attributes?.url && isChrome && (
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
                <div className="flex flex-col space-y-2 rounded-sm bg-gray-100 py-2 text-center">
                  <button className="text-xs">{acceptedFiles[0]?.name}</button>
                </div>
              )}
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
