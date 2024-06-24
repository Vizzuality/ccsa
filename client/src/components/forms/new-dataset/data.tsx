"use client";

import { useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetCountries } from "@/types/generated/country";

import { useSyncSearchParams } from "@/app/store";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { DATA_INITIAL_VALUES } from "@/containers/datasets/new";
import type { Data } from "@/containers/datasets/new";

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
import NewDatasetFormControls from "@/components/new-dataset/form-controls";

export default function NewDatasetDataForm({
  title,
  id,
  data,
  onSubmit,
  valueType,
}: {
  title: string;
  id: string;
  data: Data["data"];
  onSubmit: (data: Data["data"]) => void;
  valueType?: VALUE_TYPE;
}) {
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const countries = useMemo(
    () =>
      countriesData?.data
        ? (countriesData.data.map((country) => country.attributes?.iso3) as string[])
        : [],
    [countriesData],
  );

  const formSchema = useMemo(
    () => getFormSchema(valueType as VALUE_TYPE, countries),
    [valueType, countries],
  );

  const defaultValues = useMemo(() => {
    const c = countries.reduce(
      (acc, country) => {
        if (valueType === "number") {
          return {
            ...acc,
            [`${country}-number`]: undefined,
          };
        }
        if (valueType === "text") {
          return {
            ...acc,
            [`${country}-text`]: "",
          };
        }
        return acc;
      },
      {} as Record<string, string | number | undefined>,
    );

    return c;
  }, [countries, valueType]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const COLUMNS = DATA_COLUMNS_TYPE[valueType as VALUE_TYPE];

  const handleCancel = () => {
    console.log("cancel data", id, title);
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

  if (!valueType) return null;

  return (
    <>
      <NewDatasetFormControls title={title} id={id} handleCancel={handleCancel} />
      {/* <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button size="sm" form="dataset-data" type="submit">
            Continue
          </Button>
        </div>
      </div> */}
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={data} form={form} />
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
