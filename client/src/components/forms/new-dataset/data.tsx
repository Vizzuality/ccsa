"use client";

import { useRef, useImperativeHandle } from "react";

import { isEmpty } from "lodash-es";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGetCountries } from "@/types/generated/country";
import { useGetDatasets } from "@/types/generated/dataset";
import { useGetDatasetValues } from "@/types/generated/dataset-value";

import { GET_COUNTRIES_OPTIONS } from "@/constants/countries";

import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DATA_COLUMNS_TYPE } from "./constants";
import type { DATA_COLUMN } from "./constants";

const getFormSchema = (valueType) => {
  switch (valueType) {
    case "number":
      return z.object({
        number: z.number().nonnegative({ message: "Please enter a valid number" }),
      });
    case "resources":
      return z.object({
        title: z.string().min(1, { message: "Please enter a title" }),
        description: z.string().min(1, { message: "Please enter a description" }),
        link: z.string().url({ message: "Please enter a valid URL" }),
      });
    case "string":
    default:
      return z.object({
        string: z.string().min(1, { message: "Please enter a string" }),
      });
  }
};

export default function NewDatasetDataForm({ data, onClick, enableNavigation }) {
  const formSchema = getFormSchema(data.settings.valueType);
  const defaultValues = (() => {
    switch (data.settings.valueType) {
      case "number":
        return { number: "" };
      case "resources":
        return { title: "", description: "", link: "" };
      case "string":
      default:
        return { string: "" };
    }
  })();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { data: countriesData } = useGetCountries(GET_COUNTRIES_OPTIONS);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onClick({ ...data, settings: { ...values } });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  console.log("data.settings.data", data.settings, countriesData);
  if (data.settings.valueType) {
  }

  const getDatasetParams = {
    params: {
      "pagination[pageSize]": 300,
    },
  };

  const { data: datasetsData } = useGetDatasets({
    ...getDatasetParams.params,
    fields: ["id", "name", "unit", "value_type"],
  });

  const { data: datasetValueData } = useGetDatasetValues({
    "pagination[pageSize]": 300,
    populate: "dataset,country,resources",
  });

  console.log(datasetValueData);

  const COLUMNS: DATA_COLUMN[] = DATA_COLUMNS_TYPE["resource"];
  // data.settings.valueType as keyof typeof DATA_COLUMNS_TYPE];

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 ">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Cancel
          </Button>
          {isEmpty(data.data) && (
            <Button size="sm" onClick={() => formRef.current?.submitForm()}>
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
      <section className="flex grow flex-col items-center justify-center">
        <div className="space-y-10 py-10">
          <NewDatasetNavigation enableNavigation={enableNavigation} />
          <StepDescription />
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map(({ value, label }) => (
                  <TableHead key={value}>{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {COLUMNS.map(({ value, label }) => (
                  <TableCell key={value}>{label}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
