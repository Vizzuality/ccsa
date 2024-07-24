"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter, useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { LuTrash2 } from "react-icons/lu";
import { z } from "zod";

import { cn } from "@/lib/classnames";
import { isEmpty } from "@/lib/utils/objects";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasetValues } from "@/types/generated/dataset-value";
import {
  UsersPermissionsRole,
  UsersPermissionsUser,
  CountryListResponseDataItem,
  Resource,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import {
  useSyncSearchParams,
  datasetValuesJsonUploadedAtom,
  INITIAL_DATASET_VALUES,
} from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import DashboardFormControls from "@/components/new-dataset/form-controls";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormMessageArray,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DATA_COLUMNS_TYPE } from "./constants";
import { getFormSchema } from "./data-form-schema";
import type { VALUE_TYPE, Data, DatasetValuesCSV } from "./types";
import NewDatasetDataFormWrapper from "./wrapper";

// Types for deep nested objects function
type ParamType = "link_url" | "description" | "link_title";

interface Field {
  name: string;
}

export interface Change {
  [key: string]: { attr: ParamType; index: number }[];
}

export default function DatasetDataForm({
  title,
  id,
  header = true,
  data: rawData,
  onSubmit,
  changes,
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  onSubmit: (data: Data["data"]) => void;
  changes?: (Change | string)[];
}) {
  const [datasetValues] = useAtom(datasetValuesJsonUploadedAtom);
  const data = rawData.data;

  const { push } = useRouter();
  const URLParams = useSyncSearchParams();
  const params = useParams();

  const { id: datasetID } = params;

  const { data: session } = useSession();
  const user = session?.user;
  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };
  const isDatasetNew = isEmpty(data);

  const { data: datasetValuesData } = useGetDatasetValues(
    {
      filters: {
        dataset: datasetID,
      },
      "pagination[pageSize]": 300,
      populate: {
        country: {
          fields: ["name", "iso3"],
        },
        resources: true,
        dataset_values: true,
      },
    },
    {
      query: {
        enabled: !isDatasetNew,
      },
    },
  );

  const parsedPreviousDatasetValuesResources = useMemo<{
    [key: string]: Resource[];
  }>(() => {
    const transformedObject: { [key: string]: Resource[] } = {};

    datasetValuesData?.data?.forEach(({ attributes }) => {
      const countryCode = attributes?.country?.data?.attributes?.iso3;
      if (countryCode) {
        transformedObject[countryCode] =
          attributes?.resources?.data?.map((d) => ({
            description: d?.attributes?.description,
            link_title: d?.attributes?.link_title,
            link_url: d?.attributes?.link_url,
          })) || [];
      }
    });

    return transformedObject;
  }, [datasetValuesData]);

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const countries = useMemo(
    () => countriesData?.data?.map((country) => country) || [],
    [countriesData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        rawData.settings.value_type as VALUE_TYPE,
        countries.map((c) => c?.attributes?.iso3) as string[],
      ),
    [rawData.settings.value_type, countries],
  );

  function transformData(data: DatasetValuesCSV[]): {
    [key: string]: number | string | Resource[] | boolean | undefined;
  } {
    const result: { [key: string]: number | string | Resource[] | boolean | undefined } = {};
    const type = rawData.settings.value_type as unknown as keyof DatasetValuesCSV;

    if (!!rawData.settings.value_type && rawData.settings.value_type !== "resource") {
      data?.forEach((item) => {
        result[item.country_id] = item[type];
      });
    } else if (rawData.settings.value_type === "resource") {
      data?.forEach((item) => {
        const resource: Resource = {
          link_title: item.link_title!,
          link_url: item.link_url!,
          description: item.description!,
        };

        if (!result[item.country_id]) {
          result[item.country_id] = [];
        }

        (result[item.country_id] as Resource[]).push(resource);
      });
    }

    return result;
  }

  const parsedDatasetCSVValues = transformData(datasetValues);

  const values = useMemo(() => {
    // Check if parsedDatasetCSVValues is an empty object
    const isParsedDatasetCSVValuesEmpty = Object.keys(parsedDatasetCSVValues || {}).length === 0;
    if (rawData.settings.value_type === "resource" && isParsedDatasetCSVValuesEmpty) {
      return countries
        .map((c) => c?.attributes?.iso3 as string)
        .reduce(
          (acc, country) => {
            return {
              ...acc,
              [`${country}`]: parsedPreviousDatasetValuesResources?.[`${country}`],
            };
          },
          {} as Data["data"],
        );
    }

    const c = countries
      .map((c) => c?.attributes?.iso3 as string)
      .reduce(
        (acc, country) => {
          return {
            ...acc,
            [`${country}`]: isParsedDatasetCSVValuesEmpty
              ? data?.[country]
              : parsedDatasetCSVValues?.[country] ||
                data?.[country] ||
                parsedPreviousDatasetValuesResources?.[`${country}`],
          };
        },
        {} as Data["data"],
      );

    return c;
  }, [
    countries,
    data,
    parsedDatasetCSVValues,
    parsedPreviousDatasetValuesResources,
    rawData.settings.value_type,
  ]);

  const form = useForm<Data["data"]>({
    resolver: zodResolver(formSchema),
    values,
  });

  const COLUMNS = DATA_COLUMNS_TYPE[rawData.settings.value_type as VALUE_TYPE];

  const handleCancel = () => {
    onSubmit(INITIAL_DATASET_VALUES.data);
    push(`/?${URLParams.toString()}`);
  };

  const handleAddResource = (country: CountryListResponseDataItem) => {
    let newValues: Resource[] = [
      {
        link_title: "",
        description: "",
        link_url: "",
      },
    ];

    const values = form.getValues()[`${country.attributes?.iso3}`] as Resource[];

    if (Array.isArray(values)) {
      newValues = [
        ...values,
        {
          link_title: "",
          description: "",
          link_url: "",
        },
      ];
    }

    form.setValue(`${country.attributes?.iso3}`, newValues);
  };

  const handleDeleteResource = (country: CountryListResponseDataItem, index: number) => {
    let newValues: Resource[] = [
      {
        link_title: "",
        description: "",
        link_url: "",
      },
    ];

    const values = form.getValues()[`${country.attributes?.iso3}`] as Resource[];

    if (Array.isArray(values)) {
      newValues = values.filter((_, i) => i !== index);
    }

    form.setValue(`${country.attributes?.iso3}`, newValues);
  };

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // Save this into useState
      onSubmit(values);
    },
    [onSubmit],
  );

  const checkChanges = useCallback(
    (field: Field, index: number, param: ParamType) => {
      return changes?.find(
        (c) =>
          Object.keys(c)?.[0] === field.name &&
          Object.values(c)?.[0]?.find(
            (v: { attr: string; index: number }) => v.attr === param && v.index === index,
          ),
      );
    },
    [changes],
  );

  if (!rawData.settings.value_type) return null;

  return (
    <>
      {header && (
        <DashboardFormControls
          id={id}
          title={title}
          isNew={isDatasetNew}
          cancelVariant={ME_DATA?.role?.type === "admin" && !!id ? "reject" : "cancel"}
          handleCancel={handleCancel}
        />
      )}
      <NewDatasetDataFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} form={form} />}
        {header && <StepDescription />}
        <Form {...form}>
          <form id={id} className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <Table>
              <TableHeader>
                <TableRow>
                  {COLUMNS.map(({ value, label }) => (
                    <TableHead key={value}>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((country) => (
                  <TableRow key={country.id}>
                    {COLUMNS.map((c) => {
                      const { label, value } = c;

                      if (value === "country_id") {
                        return (
                          <TableCell key={`${country.attributes?.iso3}-${value}`}>
                            {country?.attributes?.name}
                          </TableCell>
                        );
                      }

                      if (value === "resource") {
                        return (
                          <TableCell key={`${country.attributes?.iso3}-${value}`}>
                            <FormField
                              control={form.control}
                              name={`${country.attributes?.iso3}`}
                              render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1.5">
                                  <FormLabel className="hidden text-xs">{`${country.attributes?.iso3}-${label}`}</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      {value === "resource" &&
                                        Array.isArray(field?.value) &&
                                        field?.value?.map((resource, index) => (
                                          <div className="" key={index}>
                                            <div className="flex items-end gap-2" key={index}>
                                              <div>
                                                <label
                                                  htmlFor={`${country.attributes?.iso3}-title-${index}`}
                                                  className="text-xs"
                                                >
                                                  Title
                                                </label>
                                                <Input
                                                  {...field}
                                                  name={`${country.attributes?.iso3}-title-${index}`}
                                                  value={resource.link_title}
                                                  onChange={(e) => {
                                                    let newValues: Resource[] = [
                                                      {
                                                        link_title: "",
                                                        description: "",
                                                        link_url: "",
                                                      },
                                                    ];

                                                    if (Array.isArray(field?.value)) {
                                                      newValues = field?.value?.map((r, i) => {
                                                        if (i === index) {
                                                          return {
                                                            ...r,
                                                            link_title: e.target.value,
                                                          };
                                                        }
                                                        return r;
                                                      });
                                                    }
                                                    field.onChange(newValues);
                                                  }}
                                                  className={cn({
                                                    "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                                      true,
                                                    "bg-green-400": checkChanges(
                                                      field,
                                                      index,
                                                      "link_title",
                                                    ),
                                                  })}
                                                />
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor={`${country.attributes?.iso3}-description-${index}`}
                                                  className="text-xs"
                                                >
                                                  Description
                                                </label>
                                                <Input
                                                  {...field}
                                                  name={`${country.attributes?.iso3}-description-${index}`}
                                                  value={resource.description}
                                                  onChange={(e) => {
                                                    let newValues: Resource[] = [
                                                      {
                                                        link_title: "",
                                                        description: "",
                                                        link_url: "",
                                                      },
                                                    ];

                                                    if (Array.isArray(field?.value)) {
                                                      newValues = field?.value?.map((r, i) => {
                                                        if (i === index) {
                                                          return {
                                                            ...r,
                                                            description: e.target.value,
                                                          };
                                                        }
                                                        return r;
                                                      });
                                                    }
                                                    field.onChange(newValues);
                                                  }}
                                                  className={cn({
                                                    "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                                      true,
                                                    "bg-green-400": checkChanges(
                                                      field,
                                                      index,
                                                      "link_title",
                                                    ),
                                                  })}
                                                />
                                              </div>
                                              <div>
                                                <label
                                                  htmlFor={`${country.attributes?.iso3}-link-${index}`}
                                                  className="text-xs"
                                                >
                                                  Link
                                                </label>
                                                <Input
                                                  {...field}
                                                  name={`${country.attributes?.iso3}-link-${index}`}
                                                  value={resource.link_url}
                                                  onChange={(e) => {
                                                    let newValues: Resource[] = [
                                                      {
                                                        link_title: "",
                                                        description: "",
                                                        link_url: "",
                                                      },
                                                    ];

                                                    if (Array.isArray(field?.value)) {
                                                      newValues = field?.value?.map((r, i) => {
                                                        if (i === index) {
                                                          return {
                                                            ...r,
                                                            link_url: e.target.value,
                                                          };
                                                        }
                                                        return r;
                                                      });
                                                    }
                                                    field.onChange(newValues);
                                                  }}
                                                  className={cn({
                                                    "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                                      true,
                                                    "bg-green-400": checkChanges(
                                                      field,
                                                      index,
                                                      "link_title",
                                                    ),
                                                  })}
                                                />
                                              </div>

                                              <Button
                                                className="shrink-0"
                                                type="button"
                                                variant="destructive-outline"
                                                size="icon"
                                                onClick={() => {
                                                  handleDeleteResource(country, index);
                                                }}
                                              >
                                                <LuTrash2 />
                                              </Button>
                                            </div>
                                            <FormMessageArray index={index} />
                                          </div>
                                        ))}
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={() => {
                                handleAddResource(country);
                              }}
                            >
                              Add new resource
                            </Button>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={`${country.attributes?.iso3}-${value}`}>
                          <FormField
                            control={form.control}
                            name={`${country.attributes?.iso3}`}
                            render={({ field }) => {
                              return (
                                <FormItem className="col-span-2 space-y-1.5">
                                  <FormLabel className="hidden text-xs">{`${country.attributes?.iso3}-${label}`}</FormLabel>
                                  <FormControl>
                                    <>
                                      {value === "text" && (
                                        <Input
                                          {...field}
                                          value={
                                            typeof field.value !== "undefined"
                                              ? `${field.value}`
                                              : undefined
                                          }
                                          className={cn({
                                            "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                              true,
                                            "bg-green-400": changes?.includes(field.name),
                                          })}
                                        />
                                      )}

                                      {value === "number" && (
                                        <Input
                                          {...field}
                                          value={
                                            typeof field.value === "number" ||
                                            typeof field.value === "string"
                                              ? field.value
                                              : undefined
                                          }
                                          className={cn({
                                            "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                              true,
                                            "bg-green-400": changes?.includes(field.name),
                                          })}
                                        />
                                      )}

                                      {value === "boolean" && (
                                        <Checkbox
                                          {...field}
                                          value={`${!!field.value}`}
                                          checked={!!field.value}
                                          onCheckedChange={(bool) => field.onChange(bool)}
                                        />
                                      )}
                                    </>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </form>
        </Form>
      </NewDatasetDataFormWrapper>
    </>
  );
}
