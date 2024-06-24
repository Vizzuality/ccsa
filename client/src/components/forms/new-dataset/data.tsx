"use client";

import { useRef, useImperativeHandle, useCallback, useMemo } from "react";

import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DATA_COLUMNS_TYPE } from "./constants";
import type { VALUE_TYPE, FormSchemaType } from "./types";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getFormSchema } from "./data-form-schema";

import { useSyncSearchParams } from "@/app/store";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";

import { compareData } from "@/lib/utils/objects";
import { useGetCountries } from "@/types/generated/country";

import { datasetFormStepAtom } from "@/app/store";
import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import { DATA_INITIAL_VALUES } from "@/containers/datasets/new";
import type { Data } from "@/containers/datasets/new";
import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import NewDatasetDataFormWrapper from "./wrapper";

export default function NewDatasetDataForm({
  data,
  onClick,
}: {
  data: Data;
  onClick: (data: Data) => void;
}) {
  const { replace } = useRouter();
  const URLParams = useSyncSearchParams();
  const [currentStep, setStep] = useAtom(datasetFormStepAtom);

  const { data: countriesData, isLoading } = useGetCountries(GET_COUNTRIES_OPTIONS);

  const countries2 = useMemo(
    () =>
      countriesData?.data
        ? (countriesData.data.map((country) => country.attributes?.iso3) as string[])
        : [],
    [countriesData],
  );

  const countries = ["AIA", "MEX", "USA"];

  const valueType = data.settings.value_type;

  const formSchema = useMemo(
    () => getFormSchema(valueType as VALUE_TYPE, countries),
    [valueType, countries],
  );

  const defaultValues = useMemo(() => {
    return countries.reduce(
      (acc, country) => {
        acc[`${country}-${valueType}`] =
          valueType === "resource"
            ? { title: "", description: "", link: "" }
            : valueType === "number"
            ? 0
            : valueType === "boolean"
            ? false
            : "";
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [countries, valueType]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: FormSchemaType) {
    console.log(values, "valores data");
    onClick({ ...data, data: { ...values } });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  const handleStep = useCallback(async () => {
    console.log(
      "data handle step",
      form.getValues(),
      form.formState.isValid,
      form.formState.errors,
    );
    const areEqualValues = compareData(form.getValues(), data.data);
    if (isEmpty(data.data)) {
      await form.handleSubmit(onSubmit)();
      setStep(3);
    }

    if (!areEqualValues && !isEmpty(data.data)) {
      console.log("not equal values");
      const currentValues = form.getValues();
      const fieldsToUpdate = form.formState.dirtyFields;

      Object.keys(currentValues).forEach((key) => {
        if (fieldsToUpdate[key]) {
          form.setValue(key, currentValues[key]);
        } else {
          form.setValue(key, data.data[key]);
        }
      });
      await form.handleSubmit(onSubmit)();
      setStep(3);
    }

    if (form.formState.isValid && isEmpty(data.data)) {
      console.log("valid form");
      await form.handleSubmit(onSubmit)();
      setStep(3);
    }
  }, [setStep, form.formState.isValid]);

  const COLUMNS = DATA_COLUMNS_TYPE[valueType as VALUE_TYPE];

  const handleCancel = () => {
    onClick(DATA_INITIAL_VALUES);
    replace(`/?${URLParams.toString()}`);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4  sm:px-10 md:px-24 lg:px-32">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline" onClick={handleCancel}>
            Cancel
          </Button>
          {(isEmpty(data.settings) || isEmpty(data.data)) && (
            <Button size="sm" onClick={handleStep}>
              Continue
            </Button>
          )}
          {!isEmpty(data.settings) && !isEmpty(data.data) && !isEmpty(data.colors) && (
            <Button size="sm" onClick={() => formRef.current?.submitForm()}>
              Submit
            </Button>
          )}
        </div>
      </div>
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation data={data} form={form} />
        <StepDescription />
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                      const { label, value, valueType: valuetype2 } = c;

                      return value === "country_id" ? (
                        <TableCell>{country}</TableCell>
                      ) : (
                        <TableCell key={value}>
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
