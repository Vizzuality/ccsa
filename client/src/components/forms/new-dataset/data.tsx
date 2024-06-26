"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetCountries } from "@/types/generated/country";

import { useSyncSearchParams } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import NewDatasetFormControls from "@/components/new-dataset/form-controls";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function NewDatasetDataForm({
  title,
  id,
  header = true,
  data: rawData,
  onSubmit,
}: {
  title: string;
  id: string;
  header?: boolean;
  data: Data;
  onSubmit: (data: Data["data"]) => void;
}) {
  const data = rawData.data;
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const countries = useMemo(
    () => countriesData?.data?.map((country) => country) || [],
    [countriesData],
  );

  // const countries = useMemo(() => ["AIA", "BRB", "BES"], []);

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
      {header && <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />}
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
                                          className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
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
                                          className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                        />
                                      )}

                                      {value === "title" &&
                                        Array.isArray(field?.value) &&
                                        field?.value?.map((resource, index) => (
                                          <Input
                                            {...field}
                                            key={index}
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
                                            className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                          />
                                        ))}
                                      {value === "description" &&
                                        Array.isArray(field?.value) &&
                                        field?.value?.map((resource, index) => (
                                          <Input
                                            {...field}
                                            key={index}
                                            value={resource.description}
                                            className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                          />
                                        ))}
                                      {value === "link" &&
                                        Array.isArray(field?.value) &&
                                        field?.value?.map((resource, index) => (
                                          <Input
                                            {...field}
                                            key={index}
                                            value={resource.link}
                                            className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                          />
                                        ))}

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
