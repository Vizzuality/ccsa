"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetCountries } from "@/types/generated/country";

import { useSyncSearchParams } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import type { Data } from "@/containers/datasets/new";

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
import type { VALUE_TYPE, FormSchemaType } from "./types";
import NewDatasetDataFormWrapper from "./wrapper";

export default function NewDatasetDataForm({
  title,
  id,
  data: rawData,
  onSubmit,
}: {
  title: string;
  id: string;
  data: Data;
  onSubmit: (data: Data["data"]) => void;
}) {
  const data = rawData.data;
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  // const countries = useMemo(
  //   () =>
  //     countriesData?.data
  //       ? (countriesData.data.map((country) => country.attributes?.iso3) as string[])
  //       : [],
  //   [countriesData],
  // );

  const countries = useMemo(() => ["AIA", "BRB", "BES"], []);

  const formSchema = useMemo(
    () => getFormSchema(rawData.settings.valueType as VALUE_TYPE, countries),
    [rawData.settings.valueType, countries],
  );

  const values = useMemo(() => {
    const c = countries.reduce(
      (acc, country) => {
        if (rawData.settings.valueType === "number") {
          return {
            ...acc,
            [`${country}-number`]: data[`${country}-number`],
          };
        }
        if (rawData.settings.valueType === "text") {
          return {
            ...acc,
            [`${country}-text`]: data[`${country}-text`],
          };
        }
        if (rawData.settings.valueType === "resource") {
          return {
            ...acc,
            [`${country}-title`]: data[`${country}-title`],
            [`${country}-description`]: data[`${country}-description`],
            [`${country}-link`]: data[`${country}-link`],
          };
        }
        if (rawData.settings.valueType === "boolean") {
          return {
            ...acc,
            [`${country}-boolean`]: data[`${country}-boolean`],
          };
        }
        return acc;
      },
      {} as Record<string, string | number | undefined>,
    );

    return c;
  }, [countries, rawData.settings.valueType, data]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    values,
  });

  const COLUMNS = DATA_COLUMNS_TYPE[rawData.settings.valueType as VALUE_TYPE];

  const handleCancel = () => {
    // onSubmit(DATA_INITIAL_VALUES.data);
    replace(`/?${URLParams.toString()}`);
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
      <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={rawData} id={id} />
        <StepDescription />
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
                  <TableRow key={country}>
                    {COLUMNS.map((c) => {
                      const { label, value } = c;

                      return value === "country_id" ? (
                        <TableCell key={`${country}-${value}`}>{country}</TableCell>
                      ) : (
                        <TableCell key={`${country}-${value}`}>
                          <FormField
                            control={form.control}
                            name={`${country}-${value}`}
                            render={({ field }) => {
                              return (
                                <FormItem className="col-span-2 space-y-1.5">
                                  <FormLabel className="hidden text-xs">{`${country}-${label}`}</FormLabel>
                                  <FormControl>
                                    <>
                                      {value !== "boolean" && (
                                        <Input
                                          {...field}
                                          value={field.value}
                                          className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                        />
                                      )}

                                      {value === "boolean" && (
                                        <Checkbox
                                          {...field}
                                          value={field.value}
                                          onCheckedChange={(bool) =>
                                            field.onChange(bool ? "on" : "off")
                                          }
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