"use client";

import { FC, useCallback } from "react";

import { useSession } from "next-auth/react";

import { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { Button } from "@/components/ui/button";

import { LuTrash2 } from "react-icons/lu";

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
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={handleDelete}
              className="space-x-2"
            >
              <span>Delete</span>
              <LuTrash2 />
            </Button>
          )}
          <Button
            size="sm"
            variant={(!isAdmin && isNew) || !isAdmin ? "destructive" : "primary-outline"}
            onClick={onClick}
          >
            {((isAdmin && isNew) || !isAdmin) && "Cancel"}
            {isAdmin && !isNew && "Reject"}
          </Button>

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
