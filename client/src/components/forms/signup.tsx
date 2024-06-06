"use client";

import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { usePostAuthLocalRegister } from "@/types/generated/users-permissions-auth";

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

const formSchema = z
  .object({
    username: z.string().min(1, { message: "Please enter your name" }),
    email: z.string().email({ message: "Please enter your email address" }),
    organization: z.string().min(1, { message: "Please enter your organization name" }),
    password: z.string().nonempty({ message: "Please enter your password" }).min(6, {
      message: "Please enter a password with at least 6 characters",
    }),
    "confirm-password": z
      .string()
      .nonempty({ message: "Please enter your confirmed password" })
      .min(6, { message: "Please enter a password with at least 6 characters" }),
  })
  .refine((data) => data.password === data["confirm-password"], {
    message: "Passwords do not match",
    path: ["confirm-password"],
  });

export default function Signup() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const signupMutation = usePostAuthLocalRegister();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      organization: "",
      password: "",
      "confirm-password": "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    // 3. Submit the form.
    signupMutation.mutate(
      {
        data: values,
      },
      {
        onSuccess: () => {
          signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: searchParams.get("callbackUrl") ?? "/",
          });
        },
        onError: (error) => {
          const searchParams = new URLSearchParams();
          searchParams.set("error", error?.response?.data?.error?.message ?? "Unknown error");
          replace(`/signup?${searchParams.toString()}`);
        },
      },
    );
  }

  return (
    <div className="min-w-[380px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
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
              name="organization"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs">Organization name</FormLabel>
                  <FormControl>
                    <Input
                      type="test"
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Organization name"
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
                      placeholder="Email"
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
                      type="password"
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm-password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                      placeholder="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <div className="pb-6">
            <Button className="w-full" type="submit">
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
