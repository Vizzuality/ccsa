"use client";

import { useRef, useImperativeHandle } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
import { z } from "zod";

import NewDatasetNavigation from "@/components/new-dataset/form-navigation";
import StepDescription from "@/components/new-dataset/step-description";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import NewDatasetDataFormWrapper from "./wrapper";
import ColorPicker from "@/components/ui/colorpicker";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const getFormSchema = (valueType) => {
  switch (valueType) {
    case "number":
      return z.object({
        minValue: z
          .string()
          .min(4, { message: "Please select a color" })
          .regex(hexColorRegex, { message: "Please enter a valid hex color" }),
        maxValue: z
          .string()
          .min(4, { message: "Please select a color" })
          .regex(hexColorRegex, { message: "Please enter a valid hex color" }),
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

export default function NewDatasetColorsForm({ data, onClick }) {
  const formSchema = getFormSchema(data.valueType);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxValue: "",
      minValue: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onClick({ ...data, data: { ...values } });
    // mutateDatasets({ data: values });
  }

  const formRef = useRef<{ submitForm: () => void } | null>(null);

  useImperativeHandle(formRef, () => ({
    submitForm() {
      form.handleSubmit(onSubmit)();
    },
  }));

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-300/20 py-4">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">New dataset</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button size="sm" variant="primary-outline">
            Cancel
          </Button>
          {isEmpty(data.settings) && (
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
      <NewDatasetDataFormWrapper>
        <NewDatasetNavigation enableNavigation />
        <StepDescription />

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="w-full max-w-5xl sm:grid sm:grid-cols-2 sm:gap-4">
              <FormField
                control={form.control}
                name="minValue"
                render={({ field }) => (
                  <FormItem className="w-[260px] space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of value</FormLabel>
                    <FormControl>
                      <ColorPicker
                        id="color"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxValue"
                render={({ field }) => (
                  <FormItem className="w-[260px] space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of value</FormLabel>
                    <FormControl>
                      <ColorPicker
                        id="color"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(e.target.value);
                        }}
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
