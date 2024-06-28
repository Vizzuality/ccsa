"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LuTrash2 } from "react-icons/lu";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import { useGetCountries } from "@/types/generated/country";
import { CountryListResponseDataItem } from "@/types/generated/strapi.schemas";

import { useSyncSearchParams } from "@/app/store";

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
import type { VALUE_TYPE, Data, Resource } from "./types";
import NewDatasetDataFormWrapper from "./wrapper";

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
  changes?: string[];
}) {
  const data = rawData.data;

  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const countries = useMemo(
    () => countriesData?.data?.map((country) => country) || [],
    [countriesData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        rawData.settings.valueType as VALUE_TYPE,
        countries.map((c) => c?.attributes?.iso3) as string[],
      ),
    [rawData.settings.valueType, countries],
  );

  const values = useMemo(() => {
    const c = countries
      .map((c) => c?.attributes?.iso3 as string)
      .reduce(
        (acc, country) => {
          return {
            ...acc,
            [`${country}`]: data[`${country}`],
          };
        },
        {} as Data["data"],
      );

    return c;
  }, [countries, data]);

  const form = useForm<Data["data"]>({
    resolver: zodResolver(formSchema),
    values,
  });

  const COLUMNS = DATA_COLUMNS_TYPE[rawData.settings.valueType as VALUE_TYPE];

  const handleCancel = () => {
    // onSubmit(DATA_INITIAL_VALUES.data);
    push(`/?${URLParams.toString()}`);
  };

  const handleAddResource = (country: CountryListResponseDataItem) => {
    let newValues: Resource[] = [
      {
        title: "",
        description: "",
        link: "",
      },
    ];

    const values = form.getValues()[`${country.attributes?.iso3}`] as Resource[];

    if (Array.isArray(values)) {
      newValues = [
        ...values,
        {
          title: "",
          description: "",
          link: "",
        },
      ];
    }

    form.setValue(`${country.attributes?.iso3}`, newValues);
  };

  const handleDeleteResource = (country: CountryListResponseDataItem, index: number) => {
    let newValues: Resource[] = [
      {
        title: "",
        description: "",
        link: "",
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

  if (!rawData.settings.valueType) return null;

  return (
    <>
      {header && <DashboardFormControls title={title} id={id} handleCancel={handleCancel} />}
      <NewDatasetDataFormWrapper header={header}>
        {header && <NewDatasetNavigation data={rawData} id={id} />}
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
                              render={({ field }) => {
                                return (
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
                                                    value={resource.title}
                                                    onChange={(e) => {
                                                      let newValues: Resource[] = [
                                                        {
                                                          title: "",
                                                          description: "",
                                                          link: "",
                                                        },
                                                      ];

                                                      if (Array.isArray(field?.value)) {
                                                        newValues = field?.value?.map((r, i) => {
                                                          if (i === index) {
                                                            return { ...r, title: e.target.value };
                                                          }
                                                          return r;
                                                        });
                                                      }
                                                      field.onChange(newValues);
                                                    }}
                                                    className={cn({
                                                      "h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95":
                                                        true,
                                                      "bg-green-400": changes?.includes(field.name),
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
                                                          title: "",
                                                          description: "",
                                                          link: "",
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
                                                      "bg-green-400": changes?.includes(field.name),
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
                                                    value={resource.link}
                                                    onChange={(e) => {
                                                      let newValues: Resource[] = [
                                                        {
                                                          title: "",
                                                          description: "",
                                                          link: "",
                                                        },
                                                      ];

                                                      if (Array.isArray(field?.value)) {
                                                        newValues = field?.value?.map((r, i) => {
                                                          if (i === index) {
                                                            return {
                                                              ...r,
                                                              link: e.target.value,
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
                                                      "bg-green-400": changes?.includes(field.name),
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
                                );
                              }}
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
                                            typeof field.value === "number"
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
