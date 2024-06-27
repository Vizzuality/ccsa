"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/classnames";

import { useSyncSearchParams } from "@/app/store";

import { useGetOtherToolsId, useGetOtherTools } from "@/types/generated/other-tool";

import NewDatasetFormControls from "@/components/new-dataset/form-controls";

import { usePostOtherTools } from "@/types/generated/other-tool";
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
import MarkdownEditor from "@/components/ui/markdown-editor";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import NewDatasetDataFormWrapper from "@/components/forms/new-dataset/wrapper";

export default function NewToolForm() {
  const { push } = useRouter();
  const URLParams = useSyncSearchParams();

  const changes = [];

  const params = useParams();

  const { id } = params;

  const { data: otherTool, isFetched, isFetching, isError } = useGetOtherToolsId(+id);

  const { data: otherTools } = useGetOtherTools();

  const { mutate: mutateDatasetEditSuggestion } = usePostOtherTools({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating a new tool:", data);
        push(`/dashboard`);
      },
      onError: (error) => {
        console.error("Error creating a new tool:", error);
      },
    },
    request: {},
  });

  const relationshipOptions = [
    {
      label: "Collaborator",
      value: "collaborator",
    },
    {
      label: "Donor",
      value: "donor",
    },
  ];

  const formSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }),
    organization: z.string().refine((val) => !!val, {
      message: "Please enter a valid link",
    }),
    relationship: z
      .string()
      .optional()
      .refine((val) => typeof val !== "undefined", {
        message: "Please select relationship",
      }),

    link: z.string().url({ message: "Please enter a valid URL" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: "data.name",
      organization: "data.description",
      relationship: "data.category",
      link: " data.unit",
    },
  });

  const handleCancel = () => {
    push(`/?${URLParams.toString()}`);
  };

  const handleSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    // Save this into useState
    console.log(values);
  }, []);

  return (
    <>
      <NewDatasetFormControls
        title="New collaborator"
        id="collaborators-create"
        handleCancel={handleCancel}
      />
      <NewDatasetDataFormWrapper header={true}>
        <p>Fill the organization's information</p>
        <Form {...form}>
          <form
            id="collaborators-create"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset className="m-auto w-full max-w-sm space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Organization name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.organization),
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
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Type of relationship</FormLabel>
                    <FormControl>
                      <Select value={`${field.value}`} onValueChange={(v) => field.onChange(+v)}>
                        <SelectTrigger
                          className={cn({
                            "h-10 w-full border-0 bg-gray-300/20": true,
                            "bg-green-400": changes?.includes(field.relationship),
                          })}
                        >
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions?.map(({ label, value }) => (
                            <SelectItem key={value} value={`${value}`}>
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
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Website link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.link),
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
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold">Logo image</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        value={field.value}
                        className={cn({
                          "border-none bg-gray-300/20 placeholder:text-gray-300/95": true,
                          "bg-green-400": changes?.includes(field.logo),
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
