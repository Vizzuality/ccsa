"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import Error from "next/error";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { getObjectDifferences } from "@/lib/utils/objects";

import { useGetCountries } from "@/types/generated/country";
import { useGetPillars } from "@/types/generated/pillar";
import { useGetProjectsId } from "@/types/generated/project";
import {
  useGetProjectEditSuggestionsId,
  usePostProjectEditSuggestions,
  usePutProjectEditSuggestionsId,
} from "@/types/generated/project-edit-suggestion";
import { useGetSdgs } from "@/types/generated/sdg";
import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { useSyncSearchParams } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";
import { GET_PILLARS_OPTIONS } from "@/constants/pillars";

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
import { MultiCombobox } from "@/components/ui/multicombobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { updateOrCreateProject } from "@/services/projects";

export default function ProjectForm() {
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

  // if there is no id in the route, we are creating a new project, no need to look for
  // an existing one
  const { data: projectData } = useGetProjectsId(
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
        push(`/dashboard`);
      },
      onError: (error: Error) => {
        console.error("Error creating a project suggestion:", error);
      },
    },
    request: {},
  });

  const { mutate: mutatePutProjectEditSuggestionId } = usePutProjectEditSuggestionsId({
    mutation: {
      onSuccess: () => {
        console.info("Success updating a project suggestion");
        push(`/dashboard`);
      },
      onError: (error: Error) => {
        console.error("Error updating a project suggestion:", error);
      },
    },
    request: {},
  });

  const previousData = projectsSuggestedData?.data?.attributes || projectData?.data?.attributes;

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter project's details" }),
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
    status: z.string().min(1, {
      message: "Please enter status",
    }),
    funding: z.string().min(1, {
      message: "Please enter type of funding",
    }),
    organization_type: z.string().min(1, {
      message: "Please enter organization type",
    }),
    source_country: z.string().min(1, { message: "Please select a country" }),
    objective: z.string().min(1, { message: "Please enter objective" }),
  });

  // TO - DO - add category from edit when API gets fixed
  // projectsSuggestedData?.data?.attributes?.other_tools_category ||
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(id && {
      values: {
        name: previousData?.name || "",
        info: previousData?.info || "",
        pillar:
          // previousData.updatedAt ||
          previousData?.pillar?.data?.id as number,
        amount: previousData?.amount as number,
        countries:
          previousData?.countries?.data?.map(({ id }: { id?: number }) => id as number) || [],
        sdgs: previousData?.sdgs?.data?.map(({ id }: { id?: number }) => id as number) || [],
        status: previousData?.status || "",
        funding: previousData?.funding || "",
        organization_type: previousData?.organization_type || "",
        source_country: previousData?.source_country || "",
        objective: previousData?.objective || "",
      },
    }),
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
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
                // @ts-expect-error TO-DO - fix types
                project: {
                  disconnect: [],
                  connect: [+id],
                },
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
        ).then(() => {
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

  const handleReject = () => {
    if (ME_DATA?.role?.type === "admin" && projectsSuggestedData?.data?.id) {
      mutatePutProjectEditSuggestionId({
        id: projectsSuggestedData?.data?.id,
        data: {
          data: {
            review_status: "declined",
          },
        },
      });
    }
  };

  const changes =
    !projectData?.data?.attributes && !!id && projectsSuggestedData?.data?.attributes
      ? []
      : getObjectDifferences(projectData?.data?.attributes, form.getValues());

  return (
    <>
      <DashboardFormControls
        isNew={!id}
        title="New project"
        id="projects-create"
        cancelVariant={ME_DATA?.role?.type === "admin" && !!id ? "reject" : "cancel"}
        handleReject={handleReject}
        handleCancel={handleCancel}
      />
      <NewDatasetDataFormWrapper header={true} className="m-auto w-full max-w-sm">
        <p className="m-auto w-full max-w-sm">Fill the project&apos;s information</p>
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
                    <FormLabel className="text-xs font-semibold">Project detail</FormLabel>
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
                name="info"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Info</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400 placeholder:text-black": changes?.includes(field.name),
                        })}
                        placeholder="Add info about the project"
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
                      <FormLabel className="text-xs font-semibold">Pillar</FormLabel>
                      <Select value={field.value?.toString()} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.name),
                          })}
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
                    <FormLabel className="text-xs font-semibold">Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={typeof field.value === "number" ? +field.value : undefined}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                        placeholder="Amount"
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
                      <FormLabel className="text-xs font-semibold">Countries</FormLabel>
                      <FormControl>
                        <MultiCombobox
                          values={field.value}
                          options={countriesData}
                          placeholder="Select at least one country"
                          onChange={field.onChange}
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
                      <FormLabel className="text-xs font-semibold">SDG</FormLabel>
                      <FormControl>
                        <MultiCombobox
                          values={field.value}
                          options={sdgsData}
                          placeholder="Select at least one SDG"
                          onChange={field.onChange}
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
                    <FormLabel className="text-xs font-semibold">Status</FormLabel>
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
                name="funding"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of funding</FormLabel>
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
                name="organization_type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Organization type</FormLabel>
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
                name="source_country"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Source country</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.name),
                        })}
                        placeholder="Source country"
                      />
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
                    <FormLabel className="text-xs font-semibold">Objective</FormLabel>
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
