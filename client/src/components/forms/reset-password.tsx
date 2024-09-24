"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
});

export default function ResetPassword() {
  const [inputEmailVisibility, setInputEmailVisibility] = useState(true);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: () => {
        setInputEmailVisibility(false);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ data: { email: values.email } });
  }

  return (
    <div className="min-w-[310px]">
      {inputEmailVisibility && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            </fieldset>
            <Button className="m-0 w-full" type="submit">
              Send link
            </Button>
          </form>
        </Form>
      )}
      {!inputEmailVisibility && (
        <p className="max-w-[310px] text-center text-xs font-light">
          Please take a moment to check your email inbox. We’ve sent you a message with a secure
          link to reset your password. Simply click on the link provided to proceed with updating
          your account credentials. If you don’t see the email, be sure to check your spam or junk
          folder, just in case it ended up there.
        </p>
      )}
    </div>
  );
}
