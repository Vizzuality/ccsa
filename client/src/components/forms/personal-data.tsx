"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePostAuthForgotPassword } from "@/types/generated/users-permissions-auth";

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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter your email address" }),
  username: z.string().min(1, { message: "Please enter your name" }),
  organization: z.string().min(1, { message: "Please enter your organization name" }),
  password: z.string().nonempty({ message: "Please enter your password" }).min(6, {
    message: "Please enter a password with at least 6 characters",
  }),
});

export default function PersonalData() {
  const { push } = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      organization: "",
      password: "",
    },
  });

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: () => {
        const searchParams = new URLSearchParams();
        push(`/signin?${searchParams.toString()}`);
      },
      onError: (error) => {
        console.error(`Failed to send password reset email: ${error.message}`);
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ data: { email: values.email } });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="w-full sm:grid sm:grid-cols-2 sm:gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="name"
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
                  <FormLabel className="text-xs font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Email"
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
                  <FormLabel className="text-xs font-semibold">Organization name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="organization"
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
                  <FormLabel className="text-xs font-semibold">Password</FormLabel>
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
          <Button className="m-0 w-full" type="submit">
            Send link
          </Button>
        </form>
      </Form>
    </div>
  );
}
