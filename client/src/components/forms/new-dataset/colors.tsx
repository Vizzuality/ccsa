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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  {
    label: "color1",
    value: "color1",
  },
  { label: "color2", value: "color2" },
  { label: "color2", value: "color2" },
];

const formSchema = z.object({
  maxValue: z.string().min(1, { message: "Please enter your name" }),
  minValue: z.string().refine((val) => val === "" || (val && typeof val === "string"), {
    message: "Please enter a valid unit",
  }),
});

export default function NewDatasetColorsForm({ data, onClick }) {
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
      <div className="flex items-center justify-between border-b border-gray-300/20 ">
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
      <section className="flex grow flex-col items-center justify-center">
        <div className="space-y-10 py-10">
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
                      <FormLabel className="text-xs">Type of value</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            {OPTIONS?.map(({ label, value }) => (
                              <SelectItem key={value} value={value as string}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel className="text-xs">Type of value</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            {OPTIONS?.map(({ label, value }) => (
                              <SelectItem key={value} value={value as string}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
        </div>
      </section>
    </>
  );
}
