"use client";

import { useCallback, useState } from "react";

import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import isEmpty from "lodash/isEmpty";
import { useSession } from "next-auth/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { z } from "zod";

import { usePostAuthChangePassword } from "@/types/generated/users-permissions-auth";
import { useDeleteUsersId, usePutUsersId } from "@/types/generated/users-permissions-users-roles";

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

import { FORM_DATA_FIELDS, FORM_PASSWORD_FIELDS } from "./constants";

type FormSchemaData = z.infer<typeof formSchemaData>;

const formSchemaData = z.object({
  email: z.string().email({ message: "Please enter your email address" }).optional(),
  username: z.string().min(1, { message: "Please enter your name" }).optional(),
  organization: z.string().min(1, { message: "Please enter your organization name" }).optional(),
});

const formSchemaPassword = z
  .object({
    password: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .nonempty("New password is required")
      .refine((value) => /^[a-zA-Z0-9]*$/.test(value), {
        message: "New password must be numeric, string, or alphanumeric",
      }),
    passwordConfirmation: z.string().nonempty("Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "New password and confirmation must match",
    path: ["passwordConfirmation"],
  });

export default function PersonalDataForm() {
  const [fieldsVisibility, setFieldsVisibility] = useState<{
    [key: string]: boolean;
  }>({
    newPassword: false,
    passwordConfirmation: false,
  });

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

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
        push(`/signin?${searchParams.toString()}`);
      },
      onError: (error: Error) => {
        console.error("Error deleting account:", error);
      },
    },
  });

  const { mutate: updateUserData } = usePutUsersId({
    mutation: {
      onSuccess: () => {
        console.error("Data updated");
      },
      onError: (error) => {
        console.error("Error updating data:", error);
      },
    },
  });

  const { mutate: updateUserPassword } = usePostAuthChangePassword({
    mutation: {
      onSuccess: () => {
        console.error("Password updated");
      },
      onError: (error) => {
        console.error("Error updating updating password:", error);
        const response = error?.response?.data.error;
        if (response?.status === 400 && !!response?.message) {
          if (isEmpty(response.details)) {
            formPassword.setError("password", { message: response?.message });
          } else if (!isEmpty(response.details)) {
            formPassword.setError("newPassword", { message: response?.message });
          }
        }
      },
    },
    request: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.apiToken}`,
      },
    },
  });

  // const { mutate: mutateDatasets } = usePostDatasets({
  //   mutation: {
  //     onSuccess: (data) => {
  //       queryClient.invalidateQueries(["/datasets"]);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },

  //   },
  // });
  // 2. Define a submit handler.
  function onSubmitData(values: FormSchemaData) {
    const fieldsToUpdate = Object.keys(formData.formState.dirtyFields) as (keyof FormSchemaData)[];
    const infoToUpdate = fieldsToUpdate.reduce((acc, key) => {
      acc[key] = values[key];
      return acc;
    }, {} as Partial<FormSchemaData>);

    if (user?.id) {
      updateUserData({ id: user.id.toString(), data: { ...user, ...infoToUpdate } });
    }
  }

  function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    // const fieldsToUpdate = form.formState.dirtyFields;
    if (!user?.id) return;
    updateUserPassword({
      data: {
        currentPassword: values.password,
        password: values.newPassword,
        passwordConfirmation: values.passwordConfirmation,
      },
    });
  }

  const handleAccount = useCallback(() => {
    if (!user?.id) return;
    deleteAccount({ id: user?.id.toString() });
  }, [user?.id, deleteAccount]);

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
                      key={label}
                      control={formData.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold">{label}</FormLabel>
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
                type="submit"
                className="h-9 w-full"
                disabled={isEmpty(formData.formState.dirtyFields)}
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
                      key={label}
                      control={formPassword.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold">{label}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={
                                  fieldsVisibility?.[name] || name === "password" ? type : "text"
                                }
                                className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                                placeholder={placeholder}
                              />

                              {name !== "password" && !fieldsVisibility?.[name] && (
                                <LuEye
                                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                                  onClick={() =>
                                    setFieldsVisibility({
                                      ...fieldsVisibility,
                                      [name]: !fieldsVisibility?.[name],
                                    })
                                  }
                                />
                              )}

                              {name !== "password" && fieldsVisibility?.[name] && (
                                <LuEyeOff
                                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                                  onClick={() =>
                                    setFieldsVisibility({
                                      ...fieldsVisibility,
                                      [name]: !fieldsVisibility?.[name],
                                    })
                                  }
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </fieldset>
              </div>
              <Button
                type="submit"
                className="h-9 w-full"
                disabled={isEmpty(formPassword.formState.dirtyFields)}
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
