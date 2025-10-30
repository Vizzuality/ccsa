"use client";

import Markdown from "react-markdown";

import { useCallback } from "react";

import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import Error from "next/error";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useGetCountries } from "@/types/generated/country";
import { useGetPillars } from "@/types/generated/pillar";
import { useDeleteProjectsId, useGetProjectsId } from "@/types/generated/project";
import {
  useGetProjectEditSuggestionsId,
  usePostProjectEditSuggestions,
  usePutProjectEditSuggestionsId,
  useDeleteProjectEditSuggestionsId,
} from "@/types/generated/project-edit-suggestion";
import { useGetProjectStatuses } from "@/types/generated/project-status";
import { useGetOrganizationTypes } from "@/types/generated/organization-type";
import { useGetSdgs } from "@/types/generated/sdg";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetTypesOfFundings } from "@/types/generated/types-of-funding";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";
import { useGetWorldCountries } from "@/types/generated/world-country";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_PILLARS_OPTIONS } from "@/constants/pillars";
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
import { MultiCombobox } from "@/components/ui/multicombobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LuInfo } from "react-icons/lu";

import { TooltipPortal } from "@radix-ui/react-tooltip";

import { updateOrCreateProject } from "@/services/projects";
import CSVImport from "@/components/new-dataset/step-description/csv-import";
import { useGetObjectives } from "@/types/generated/objective";
import { useGetProjectFieldMetadata } from "@/types/generated/project-field-metadata";

const ProjectFieldLabel = ({
  title,
  data,
  required = false,
}: {
  title: string;
  data: string | undefined;
  required?: boolean;
}) => (
  <FormLabel className="flex items-center text-xs font-semibold">
    <span>
      {title}
      {required && <sup className="pl-0.5">*</sup>}
    </span>
    <Tooltip>
      <TooltipTrigger>
        <LuInfo className="h-4 w-4 pl-1 font-bold" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent side="right" align="center">
          <Markdown className="prose text-xxs">{data}</Markdown>
          <TooltipArrow className="fill-white" width={10} height={5} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  </FormLabel>
);

export default function ProjectForm() {
  const { push, back } = useRouter();
  const params = useParams();

  const { id } = params;

  const { data } = useSession();
  const user = data?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // Hooks to populate dropdowns in the form
  const { data: pillarsData } = useGetPillars(GET_PILLARS_OPTIONS, {
    query: {
      select: (data) =>
        data?.data?.map((pillar) => ({
          label: pillar?.attributes?.name as string,
          value: pillar?.id as number,
        })),
    },
  });

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS, {
    query: {
      select: (data) =>
        data?.data?.map((country) => ({
          label: country?.attributes?.name as string,
          value: country?.id as number,
        })),
    },
  });

  const { data: sdgsData } = useGetSdgs(
    {
      "pagination[pageSize]": 100,
      sort: "name:asc",
    },
    {
      query: {
        select: (data) =>
          data?.data?.map((sdg) => ({
            label: sdg?.attributes?.name as string,
            value: sdg?.id as number,
          })),
      },
    },
  );

  const { data: typesOfFundingData } = useGetTypesOfFundings(
    {
      "pagination[pageSize]": 100,
      sort: "name:asc",
    },
    {
      query: {
        select: (data) =>
          data?.data?.map((funding) => ({
            label: funding?.attributes?.name as string,
            value: funding?.id as number,
          })),
      },
    },
  );

  const { data: typesOfProjectStatus } = useGetProjectStatuses(
    {
      "pagination[pageSize]": 100,
      sort: "name:asc",
    },
    {
      query: {
        select: (data) =>
          data?.data?.map((status) => ({
            label: status?.attributes?.name as string,
            value: status?.id as number,
          })),
      },
    },
  );

  const { data: organizationTypes } = useGetOrganizationTypes(
    {
      "pagination[pageSize]": 100,
      sort: "name:asc",
    },
    {
      query: {
        select: (data) =>
          data?.data?.map((status) => ({
            label: status?.attributes?.name as string,
            value: status?.id as number,
          })),
      },
    },
  );

  const { data: worldCountries } = useGetWorldCountries(
    {
      "pagination[pageSize]": 300,
      sort: "name:asc",
    },
    {
      query: {
        select: (data) =>
          data?.data?.map((status) => ({
            label: status?.attributes?.name as string,
            value: status?.id as number,
          })),
      },
    },
  );

  const { data: projectObjectives } = useGetObjectives(
    {},
    {
      query: {
        select: (data) =>
          data?.data?.map((objective) => ({
            label: objective?.attributes?.type as string,
            value: objective?.id as number,
          })),
      },
    },
  );

  // if there is no id in the route, we are creating a new project, no need to look for
  // an existing one
  const { data: projectData } = useGetProjectsId(
    +id,
    {
      populate: {
        pillar: true,
        sdgs: true,
        countries: {
          fields: ["name"],
        },
        status: {
          fields: ["name"],
        },
        funding: {
          fields: ["name"],
        },
        objective: {
          fields: ["type"],
        },
        organization_type: {
          fields: ["name"],
        },
        source_country: {
          fields: ["name"],
        },
      },
    },
    {
      query: {
        enabled: !!id,
      },
    },
  );

  const { data: dataInfo } = useGetProjectFieldMetadata();

  const { data: projectsSuggestedData } = useGetProjectEditSuggestionsId(
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

  const { mutate: mutatePostProjectEditSuggestion } = usePostProjectEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a project suggestion:", data);
        toast.success("Success creating a project suggestion");
        push(`/dashboard`);
      },
      onError: (error: Error) => {
        console.error("Error creating a project suggestion:", error);
        toast.error("There was a problem creating the project suggestion");
      },
    },
    request: {},
  });

  const { mutate: mutatePutProjectEditSuggestionId } = usePutProjectEditSuggestionsId({
    mutation: {
      onSuccess: (data) => {
        console.info("Success updating a project suggestion");
        toast.success("Success updating a project suggestion");
        if (
          data?.data?.attributes?.review_status === "declined" ||
          data?.data?.attributes?.review_status === "pending" ||
          ME_DATA?.role?.type === "authenticated"
        ) {
          push(`/dashboard`);
        }
        push(`/projects`);
      },
      onError: (error: Error) => {
        console.error("Error updating a project suggestion:", error);
        toast.error("There was a problem updating the project suggestion");
      },
    },
    request: {},
  });

  const { mutate: mutateDeleteProjectsId } = useDeleteProjectsId({
    mutation: {
      onSuccess: () => {
        console.info("Success deleting a project");
        toast.success("Success deleting a project");
        push(`/projects`);
      },
      onError: (error: Error) => {
        console.error("Error deleting a project:", error);
        toast.error("There was a problem deleting the project");
      },
    },
  });

  const { mutate: mutateDeleteProjectEditSuggestionId } = useDeleteProjectEditSuggestionsId({
    mutation: {
      onSuccess: () => {
        console.info("Success deleting a suggested project");
        toast.success("Success deleting a suggested project");
        push(`/projects`);
      },
      onError: (error: Error) => {
        console.error("Error deleting a project suggestion:", error);
        toast.error("There was a problem deleting the project suggestion");
      },
    },
  });

  const previousData = projectsSuggestedData?.data?.attributes || projectData?.data?.attributes;

  const otherFundingDisplay = typesOfFundingData?.find((type) => type.label === "Other")?.value;

  const formSchema = z
    .object({
      name: z.string().min(1, { message: "Please enter project's details" }),
      description: z.string().min(1, { message: "Please enter project's description" }),
      info: z.string().optional(),
      pillar: z.coerce.number().min(1, {
        message: "Please select at least one pillar",
      }),
      amount: z.coerce
        .number()
        .optional()
        .refine((val) => typeof val !== "undefined", {
          message: "Please enter amount",
        }),
      countries: z.array(z.number().min(1, { message: "Please select at least one country" })),

      sdgs: z.array(
        z.number().min(1, {
          message: "Please select a sdg",
        }),
      ),
      status: z.coerce.number().min(1, {
        message: "Please enter status",
      }),
      funding: z.coerce.number().min(1, {
        message: "Please select type of funding",
      }),
      other_funding: z.string().trim().optional(),
      organization_type: z.coerce.number().min(1, {
        message: "Please enter organization type",
      }),
      source_country: z.coerce.number().min(1, { message: "Please select a country" }),
      objective: z.coerce.number().min(1, { message: "Please enter objective" }),
      video_link: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.funding === otherFundingDisplay) {
        if (!data.other_funding || data.other_funding.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify funding",
            path: ["other_funding"],
          });
        }
      }
    });

  // TO - DO - add category from edit when API gets fixed
  // projectsSuggestedData?.data?.attributes?.other_tools_category ||
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(id && {
      values: {
        name: previousData?.name || "",
        description: previousData?.highlight || "",
        info: previousData?.info || "",
        pillar:
          // previousData.updatedAt ||
          previousData?.pillar?.data?.id as number,
        amount: previousData?.amount as number,
        countries:
          previousData?.countries?.data?.map(({ id }: { id?: number }) => id as number) || [],
        sdgs: previousData?.sdgs?.data?.map(({ id }: { id?: number }) => id as number) || [],
        status: previousData?.status?.data?.id as number,
        funding: previousData?.funding?.data?.id as number,
        organization_type: previousData?.organization_type?.data?.id as number,
        source_country: previousData?.source_country?.data?.id as number,
        objective: previousData?.objective?.data?.id as number,
        video_link: previousData?.video_link || "",
      },
    }),
  });
  const fundingType = useWatch({ control: form.control, name: "funding" });

  const handleCancel = () => {
    back();
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (ME_DATA?.role?.type === "authenticated") {
        if (!!id && !!projectsSuggestedData) {
          mutatePutProjectEditSuggestionId({
            id: +id,
            data: {
              data: {
                ...values,
                countries: {
                  // @ts-expect-error TO-DO - fix types
                  connect: values.countries,
                  disconnect: [],
                },
                ...(values.pillar && {
                  pillar: {
                    disconnect: [],
                    connect: [values.pillar],
                  },
                }),
                ...(values.sdgs && {
                  sdgs: {
                    disconnect: [],
                    connect: values.sdgs,
                  },
                }),
                review_status: "pending",
              },
            },
          });
        }
        if ((!!id && !projectsSuggestedData) || !id) {
          mutatePostProjectEditSuggestion({
            data: {
              data: {
                ...values,
                ...(id && {
                  project: {
                    disconnect: [],
                    connect: [+id],
                  },
                }),
                countries: {
                  // @ts-expect-error TO-DO - fix types
                  connect: values.countries,
                  disconnect: [],
                },
                ...(values.pillar && {
                  pillar: {
                    disconnect: [],
                    connect: [values.pillar],
                  },
                }),
                ...(values.sdgs && {
                  sdgs: {
                    disconnect: [],
                    connect: values.sdgs,
                  },
                }),
                review_status: "pending",
              },
            },
          });
        }
      }

      if (ME_DATA?.role?.type === "admin" && data?.apiToken) {
        // if there is no id, or the id comes from a
        // suggestion, we are creating a new project

        updateOrCreateProject(
          {
            ...(id && !projectsSuggestedData && { id }),
            ...(id &&
              !!projectsSuggestedData && {
                id: 366,
              }),
            ...values,
          },
          data?.apiToken,
          // to do review data + change sug status
        )
          .then(() => {
            console.info("Success creating a new project esta entrando aqui");
            toast.success("Success creating a new project");

            if (projectsSuggestedData) {
              mutatePutProjectEditSuggestionId({
                id: +id,
                data: {
                  data: {
                    ...values,
                    countries: {
                      // @ts-expect-error TO-DO - fix types
                      connect: values.countries,
                      disconnect: [],
                    },
                    ...(values.pillar && {
                      pillar: {
                        disconnect: [],
                        connect: [values.pillar],
                      },
                    }),
                    ...(values.sdgs && {
                      sdgs: {
                        disconnect: [],
                        connect: values.sdgs,
                      },
                    }),
                    review_status: "approved",
                  },
                },
              });
            }
            push(`/projects`);
          })
          .catch((error: Error) => {
            toast.error("There was a problem creating the dataset");
            console.error("Error creating dataset:", error);
          });
      }
    },

    [
      ME_DATA?.role?.type,
      data?.apiToken,
      push,
      id,
      mutatePutProjectEditSuggestionId,
      mutatePostProjectEditSuggestion,
      projectsSuggestedData,
    ],
  );

  const handleReject = ({ message }: { message?: string }) => {
    if (ME_DATA?.role?.type === "admin" && projectsSuggestedData?.data?.id) {
      mutatePutProjectEditSuggestionId({
        id: projectsSuggestedData?.data?.id,
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
    if (projectData?.data?.id) {
      mutateDeleteProjectsId({ id: +id });
    } else if (projectsSuggestedData?.data?.id) {
      mutateDeleteProjectEditSuggestionId({
        id: projectsSuggestedData?.data?.id,
      });
    }
  }, [id, mutateDeleteProjectsId]);

  const changes =
    !projectData?.data?.attributes && !!id && projectsSuggestedData?.data?.attributes
      ? []
      : getObjectDifferences(projectData?.data?.attributes, form.getValues());

  const suggestionStatus = projectsSuggestedData?.data?.attributes?.review_status;

  return (
    <>
      <DashboardFormControls
        isNew={!id}
        title={!id ? "New project" : "Edit project"}
        id="projects-create"
        handleReject={handleReject}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        status={suggestionStatus}
        message={projectsSuggestedData?.data?.attributes?.review_decision_details}
      />

      <div className="py-10 sm:px-10 md:px-24 lg:px-32">
        <CSVImport
          valueType="project"
          values={{
            data: {
              name: "",
              highlight: "",
              status: "",
              objective: "",
              amount: "",
              countries: "",
              source_country: "",
              sdgs: "",
              pillars: "",
              organization_type: "",
              info: "", // If no info, keep it as an empty string
              funding: "", // If no funding, keep it as an empty string
            },
          }}
        />
      </div>
      <DashboardFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p className="m-auto w-full max-w-sm">
          Fill the project&apos;s information{" "}
          <span className="text-sm font-light">
            (<sup>*</sup>required fields)
          </span>
        </p>
        <Form {...form}>
          <form
            id="projects-create"
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
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Description"
                      data={dataInfo?.data?.attributes?.highlight}
                      required
                    />
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        placeholder="Description"
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
                name="info"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel title="Info" data={dataInfo?.data?.attributes?.info} />
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        placeholder="Add info about the project"
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
                name="pillar"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-1.5">
                      <ProjectFieldLabel
                        title="Pillar"
                        data={dataInfo?.data?.attributes?.pillar}
                        required
                      />
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          {(pillarsData || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Amount (USD)"
                      data={dataInfo?.data?.attributes?.amount}
                      required
                    />
                    <FormControl>
                      <Input
                        {...field}
                        value={typeof field.value === "number" ? +field.value : undefined}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        placeholder="Amount"
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
                name="countries"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-1.5">
                      <ProjectFieldLabel
                        title="Countries"
                        data={dataInfo?.data?.attributes?.countries}
                        required
                      />
                      <FormControl>
                        <MultiCombobox
                          values={field.value}
                          options={countriesData}
                          placeholder="Select at least one country"
                          onChange={field.onChange}
                          disabled={
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="sdgs"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-1.5">
                      <ProjectFieldLabel
                        title="SDG"
                        data={dataInfo?.data?.attributes?.sdgs}
                        required
                      />
                      <FormControl>
                        <MultiCombobox
                          values={field.value}
                          options={sdgsData}
                          placeholder="Select at least one SDG"
                          onChange={field.onChange}
                          disabled={
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Status"
                      data={dataInfo?.data?.attributes?.status}
                      required
                    />
                    <FormControl>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          <SelectValue placeholder="Project status" />
                        </SelectTrigger>
                        <SelectContent>
                          {(typesOfProjectStatus || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funding"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Type of funding"
                      data={dataInfo?.data?.attributes?.funding}
                      required
                    />
                    <FormControl>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          {(typesOfFundingData || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {otherFundingDisplay === Number(fundingType) && (
                <FormField
                  control={form.control}
                  name="other_funding"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <ProjectFieldLabel
                        title="Specify type of funding"
                        data={dataInfo?.data?.attributes?.other_funding}
                        required
                      />
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value}
                          className={cn({
                            "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                            "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                          })}
                          placeholder="Specify funding"
                          disabled={
                            ME_DATA?.role?.type === "authenticated" &&
                            suggestionStatus === "declined"
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="organization_type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Organization type"
                      data={dataInfo?.data?.attributes?.organization_type}
                      required
                    />
                    <FormControl>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          {(organizationTypes || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_country"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Source country"
                      data={dataInfo?.data?.attributes?.source_country}
                      required
                    />
                    <FormControl>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          {(worldCountries || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Objective"
                      data={dataInfo?.data?.attributes?.objective}
                      required
                    />
                    <FormControl>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
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
                          {(projectObjectives || []).map(({ label, value }) => {
                            return (
                              <SelectItem key={value} value={value?.toString()}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video_link"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <ProjectFieldLabel
                      title="Video link"
                      data={dataInfo?.data?.attributes?.video_link}
                    />
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-gray-400": changes?.includes(field.name),
                        })}
                        placeholder="Video link"
                        disabled={
                          ME_DATA?.role?.type === "authenticated" && suggestionStatus === "declined"
                        }
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
