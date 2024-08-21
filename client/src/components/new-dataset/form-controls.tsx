"use client";

import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { LuTrash2 } from "react-icons/lu";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, Dialog, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type DashboardFormControls = {
  isNew?: boolean;
  id: string;
  title: string;
  handleReject?: (arg: { message: string }) => void;
  handleCancel: () => void;
  handleDelete: () => void;
  status: "approved" | "pending" | "declined";
  message?: string;
};

export const DashboardFormControls: FC<DashboardFormControls> = ({
  isNew,
  title,
  id,
  handleReject,
  handleCancel,
  handleDelete,
  status,
  message,
}: DashboardFormControls) => {
  const { data } = useSession();
  const { user } = data ?? {};
  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };
  const isAdmin = ME_DATA?.role?.type === "admin";

  const formSchema = z.object({
    message: z.string().min(1, { message: "Please provide a reason for the rejection" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleDeclinedStatus = useCallback(
    (values: z.infer<typeof formSchema>) => {
      !!handleReject && handleReject(values);
    },
    [handleReject],
  );

  return (
    <div className="flex w-full flex-col border-b border-gray-300/20  sm:px-10 md:px-24 lg:px-32">
      <div className="flex items-baseline justify-between py-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{title}</h1>
          {status && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">
                Status: <span className="inline-block first-letter:uppercase">{status}</span>
              </p>
              {message && <p className="text-sm text-gray-500 first-letter:uppercase">{message}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          {isAdmin && !isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive-outline" className="space-x-2">
                  <span>Delete</span>
                  <LuTrash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove your data from our
                    database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {(isAdmin && isNew) ||
            (!isAdmin && (
              <Button size="sm" variant="primary-outline" onClick={handleCancel}>
                Cancel
              </Button>
            ))}
          {isAdmin && !isNew && (
            <Dialog>
              <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl py-4">
                <DialogTitle className="p-4">Reasons for Suggestion Rejection</DialogTitle>
                <Form {...form}>
                  <form
                    id="decline-message"
                    className="space-y-4 px-4"
                    onSubmit={form.handleSubmit(handleDeclinedStatus)}
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value}
                              className="border-none bg-gray-300/20 placeholder:text-gray-300/95"
                              placeholder="Entry your message here"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pb-4">
                      <Button size="sm" form="decline-message">
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          <Button form={id} size="sm" type="submit">
            {!isAdmin && "Continue"}
            {isAdmin && isNew && "Submit"}
            {isAdmin && !isNew && "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFormControls;
