"use client";

import { useCallback } from "react";

import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

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

import { RiDeleteBinLine } from "react-icons/ri";
import { FORM_DATA_FIELDS, FORM_PASSWORD_FIELDS } from "./constants";

import { useDeleteUsersId } from "@/types/generated/users-permissions-users-roles";

type FormSchemaData = z.infer<typeof formSchemaData>;

const formSchemaData = z.object({
  email: z.string().email({ message: "Please enter your email address" }).optional(),
  username: z.string().min(1, { message: "Please enter your name" }).optional(),
  organization: z.string().min(1, { message: "Please enter your organization name" }).optional(),
});

const formSchemaPassword = z
  .object({
    password: z.string().optional(),
    newPassword: z.string().optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is filled, newPassword and confirmation must be provided and must match
      if (data.password) {
        return (
          data.newPassword &&
          data.passwordConfirmation &&
          data.newPassword === data.passwordConfirmation
        );
      }
      return true; // If password is not filled, no further validation is required
    },
    {
      message:
        "New password and confirmation must be provided and must match when password is filled",
      path: ["newPassword", "confirmation"],
    },
  );

export default function PersonalDataForm() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

  console.log(user);

  // 1. Define your form.
  const formData = useForm<z.infer<typeof formSchemaData>>({
    resolver: zodResolver(formSchemaData),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      organization: user?.organization || "",
    },
  });

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      password: user?.password || "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const { mutate: deleteAccount } = useDeleteUsersId({
    mutation: {
      onSuccess: () => {
        replace(`/signin?${searchParams.toString()}`);
      },
      onError: (error: Error) => {
        console.error("Error creating dataset:", error);
      },
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
  function onSubmitData(values: FormSchemaData) {
    const fieldsToUpdate = Object.keys(formData.formState.dirtyFields) as (keyof FormSchemaData)[];
    const infoToUpdate = fieldsToUpdate.reduce((acc, key) => {
      acc[key] = values[key];
      return acc;
    }, {} as Partial<FormSchemaData>);
    mutate({ data: { ...user, ...infoToUpdate } });
  }

  function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    // const fieldsToUpdate = form.formState.dirtyFields;
    mutate({ data: { email: values.password } });
  }

  const handleAccount = useCallback(() => {
    if (!user?.id) return;
    deleteAccount({ id: user?.id.toString() });
  }, []);

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Personal data</h1>
          <Button
            type="button"
            variant="destructive-outline"
            className="space-x-2.5"
            onClick={handleAccount}
          >
            <span>Delete account</span>
            <RiDeleteBinLine className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid w-full max-w-5xl grid-cols-2 gap-16">
          <Form {...formData}>
            <form onSubmit={formData.handleSubmit(onSubmitData)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl -tracking-[0.0375rem]">Edit data</h2>
                <fieldset className="flex flex-col space-y-4">
                  {FORM_DATA_FIELDS.map(({ name, label, type, placeholder }) => (
                    <FormField
                      control={formData.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs">{label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={type}
                              className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                              placeholder={placeholder || label}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </fieldset>
              </div>
              <Button
                {...formData}
                onClick={handleAccount}
                type="submit"
                className="h-9 w-full"
                disabled={!formData.formState.dirtyFields}
              >
                Save
              </Button>
            </form>
          </Form>
          <Form {...formPassword}>
            <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl -tracking-[0.0375rem]">Edit Password</h2>
                <fieldset className="space-y-4">
                  {FORM_PASSWORD_FIELDS.map(({ name, label, type, placeholder }) => (
                    <FormField
                      control={formPassword.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs">{label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={type}
                              className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                              placeholder={placeholder}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </fieldset>
              </div>
              <Button
                type="button"
                className="h-9 w-full"
                disabled={!formPassword.formState.dirtyFields}
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
