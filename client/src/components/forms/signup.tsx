"use client";

import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { usePostAuthLocalRegister } from "@/types/generated/users-permissions-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="min-w-[380px]">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        {!!searchParams.get("error") && (
          <div className="rounded-md bg-destructive/90 p-3 text-sm text-destructive-foreground">
            {searchParams.get("error")}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <fieldset className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization name</FormLabel>
                    <FormControl>
                      <Input type="test" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm-password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <div className="space-y-3">
              <Button className="w-full" type="submit">
                Sign up
              </Button>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link className="text-primary hover:underline" href="/signin">
                  Sign in
                </Link>{" "}
                instead.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
