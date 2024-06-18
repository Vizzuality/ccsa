"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSession } from "next-auth/react";

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

import {
  usePostAuthForgotPassword,
  // usePostAuthChangePassword,
} from "@/types/generated/users-permissions-auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter your email address" }).optional(),
  username: z.string().min(1, { message: "Please enter your name" }).optional(),
  organization: z.string().min(1, { message: "Please enter your organization name" }).optional(),
  password: z
    .string()
    .nonempty({ message: "Please enter your password" })
    .min(6, {
      message: "Please enter a password with at least 6 characters",
    })
    .optional(),
});

export default function PersonalDataForm() {
  const [hasEditionEnabled, enableEdition] = useState(false);
  const { replace } = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      organization: user?.organization || "",
      password: user?.password || "",
    },
  });

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: (data) => {
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
    // const fieldsToUpdate = form.formState.dirtyFields;
    mutate({ data: { email: values.email } });
  }

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Personal data</h1>
              {!hasEditionEnabled && <Button onClick={() => enableEdition(true)}>Edit</Button>}
              {/* Check if there are changes to save on any of the fields */}
              {hasEditionEnabled && (
                <div className="flex space-x-2">
                  <Button onClick={() => enableEdition(false)}>Cancel</Button>
                  <Button disabled={!form.formState.isDirty} type="submit">
                    Save
                  </Button>
                </div>
              )}
            </div>
            <fieldset className="w-full max-w-5xl sm:grid sm:grid-cols-2 sm:gap-4">
              <FormField
                control={form.control}
                disabled={!hasEditionEnabled}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={user?.username || "Name"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={user?.email || "Email"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs">Organization name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder={user?.organization || "Organization name"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                        placeholder="password"
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
    </div>
  );
}
