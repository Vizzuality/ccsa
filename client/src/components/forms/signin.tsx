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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter your email address" }),
  password: z.string().nonempty({ message: "Please enter your password" }),
});

export default function Signin() {
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
      email: values.email,
      password: values.password,
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
    });
  }

  return (
    <Card className="min-w-[380px]">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        {!!searchParams.get("error") && (
          <div className="rounded-md bg-destructive p-3 text-sm text-destructive-foreground">
            Invalid username or password. Please try again.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <fieldset className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
            </fieldset>

            <div className="space-y-3">
              <Button className="w-full" type="submit">
                Sign in
              </Button>
              <p className="text-center text-sm">
                {"Don't"} have an account?{" "}
                <Link className="text-primary hover:underline" href="/signup">
                  Sign up
                </Link>{" "}
                instead.
              </p>
              <p className="text-center text-sm">
                Forgot you password?{" "}
                <Link className="text-primary hover:underline" href="/forgot-password">
                  Reset password
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
