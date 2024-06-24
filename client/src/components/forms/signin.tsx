"use client";

import { useState } from "react";
import { set, useForm } from "react-hook-form";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

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
  password: z.string().min(1, { message: "Please enter your password" }),
});

export default function Signin() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-4">
          <fieldset className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold">Password</FormLabel>
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
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="m-0 w-full" type="submit">
            Sign in
          </Button>
        </form>
        <Link
          className="block py-6 text-center text-sm font-semibold text-primary underline"
          href="/reset-password"
        >
          Forgot your password?
        </Link>
      </Form>
    </div>
  );
}
