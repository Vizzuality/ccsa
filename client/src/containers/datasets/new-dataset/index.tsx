"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usePostAuthForgotPassword } from "@/types/generated/users-permissions-auth";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  valueType: z.string().email({ message: "Please enter your email address" }),
  category: z.string().min(1, { message: "Please enter your organization name" }),
  unit: z
    .string()
    .nonempty({ message: "Please enter your password" })
    .min(6, {
      message: "Please enter a password with at least 6 characters",
    })
    .optional(),
});

export default function NewDatasetForm() {
  const { replace } = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  console.log(user);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      valueType: "",
      category: "",
      unit: "",
    },
  });

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: (data) => {
        console.log("Success creating dataset:", data);
        const searchParams = new URLSearchParams();
        replace(`/signin?${searchParams.toString()}`);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const fieldsToUpdate = form.formState.dirtyFields;
    mutate({ data: { email: values.email } });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="w-full max-w-5xl sm:grid sm:grid-cols-2 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="min-w-[260px] space-y-1.5">
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valueType"
              render={({ field }) => (
                <FormItem className="min-w-[260px] space-y-1.5">
                  <FormLabel className="text-xs">Type of value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="valueType"
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
                <FormItem className="min-w-[260px] space-y-1.5">
                  <FormLabel className="text-xs">Category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="min-w-[260px] space-y-1.5">
                  <FormLabel className="text-xs">Unit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="unit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="col-span-2 space-y-1.5">
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="textarea"
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Add a description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
