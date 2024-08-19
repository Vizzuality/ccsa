"use client";

import { FC } from "react";

import { useSession } from "next-auth/react";

import { LuTrash2 } from "react-icons/lu";

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
import { DialogContent, Dialog, DialogTrigger, DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";

type DashboardFormControls = {
  isNew?: boolean;
  id: string;
  title: string;
  handleReject?: () => void;
  handleCancel: () => void;
  handleDelete: () => void;
  status: "approved" | "pending" | "declined";
};

export const DashboardFormControls: FC<DashboardFormControls> = ({
  isNew,
  title,
  id,
  handleReject,
  handleCancel,
  handleDelete,
  status,
}: DashboardFormControls) => {
  const { data } = useSession();
  const { user } = data ?? {};
  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };
  const isAdmin = ME_DATA?.role?.type === "admin";

  const onClick = isAdmin && !isNew ? handleReject : handleCancel;

  return (
    <div className="flex w-full flex-col border-b border-gray-300/20  sm:px-10 md:px-24 lg:px-32">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{title}</h1>
          {status && (
            <p className="text-sm text-gray-500">
              Status: <span className="inline-block first-letter:uppercase">{status}</span>
            </p>
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
              <Button size="sm" variant="primary-outline" onClick={onClick}>
                Cancel
              </Button>
            ))}
          {isAdmin && !isNew && (
            <Dialog>
              <DialogTrigger onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Reasons for Suggestion Rejection</DialogTitle>
                <Textarea />
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
