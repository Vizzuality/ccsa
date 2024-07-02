"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoadCanvasTemplate,
  validateCaptcha,
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
} from "@vinhpd/react-simple-captcha";
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
    captcha: z.string().nonempty({ message: "Please enter the captcha" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data["confirm-password"]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm-password"], // Path to the specific field
      });
    }
  });

interface ExtendedProps {
  reloadColor?: string;
}

const LoadCanvasTemplateComp: React.FC<ExtendedProps> = (props) => {
  return <LoadCanvasTemplate reloadColor="#0996CC" {...props} />;
};

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
      captcha: "",
    },
  });

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!!validateCaptcha(values.captcha)) {
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
    } else {
      form.setError("captcha", { message: "Captcha does not match" });
    }
  }

  return (
    <div className="min-w-[380px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!!searchParams.get("error") && (
            <div className="rounded-md bg-destructive p-3 text-sm text-destructive-foreground">
              {searchParams.get("error")}
            </div>
          )}

          <fieldset className="space-y-4">
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
                  <FormLabel className="text-xs font-semibold">Organization name</FormLabel>
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
            <FormField
              control={form.control}
              name="confirm-password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold">Confirm Password</FormLabel>
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

            <div className="grid grid-cols-2 gap-2 rounded bg-gray-300/20 p-2.5">
              <div className="flex justify-center rounded bg-white pt-2 text-center text-xxs">
                <LoadCanvasTemplateComp />
              </div>
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only text-xs">Type image values</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="border-none bg-transparent placeholder:text-gray-300/95"
                        placeholder="Type image values"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
