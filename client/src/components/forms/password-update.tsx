"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import isEmpty from "lodash/isEmpty";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { z } from "zod";

import { usePostAuthResetPassword } from "@/types/generated/users-permissions-auth";

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

export type FormPasswordFieldsProps = {
  label: string;
  name: "newPassword" | "passwordConfirmation";
  type: string;
  placeholder: string;
}[];

export const FORM_PASSWORD_FIELDS: FormPasswordFieldsProps = [
  {
    label: "New password",
    name: "newPassword",
    type: "password",
    placeholder: "Enter your new password",
  },
  {
    label: "Confirm new password",
    name: "passwordConfirmation",
    type: "password",
    placeholder: "Confirm your new password",
  },
];

const formSchemaPassword = z
  .object({
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

  const params = useSearchParams();
  const recoveryCode = params.get("code") as string;

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const { mutate: updateUserPassword } = usePostAuthResetPassword({
    mutation: {
      onSuccess: () => {
        console.info("Password updated successfully");
        toast.success("Password updated successfully");
      },
      onError: (error) => {
        console.error("Error updating updating password:", error);
        const response = error?.response?.data.error;
        if (response?.status === 400 && !!response?.message) {
          if (!isEmpty(response.details)) {
            formPassword.setError("newPassword", { message: response?.message });
          }
        }
        toast.error("Error updating password");
      },
    },
    request: {},
  });

  function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    updateUserPassword({
      data: {
        code: recoveryCode,
        password: values.newPassword,
        passwordConfirmation: values.passwordConfirmation,
      },
    });
  }

  return (
    <div className="min-w-[310px]">
      <Form {...formPassword}>
        <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-6">
          <div className="space-y-4">
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
                            type={type}
                            className="h-9 border-none bg-gray-300/20 placeholder:text-gray-300/95"
                            placeholder={placeholder}
                          />

                          {!fieldsVisibility?.[name] && (
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

                          {fieldsVisibility?.[name] && (
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
  );
}
