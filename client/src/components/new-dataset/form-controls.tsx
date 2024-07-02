"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

type DashboardFormControls = {
  isNew?: boolean;
  cancelVariant?: "reject" | "cancel";
  id: string;
  title: string;
  handleReject?: () => void;
  handleCancel: () => void;
};

export const DashboardFormControls: FC<DashboardFormControls> = ({
  isNew,
  cancelVariant,
  title,
  id,
  handleReject,
  handleCancel,
}: DashboardFormControls) => {
  const { data } = useSession();
  const { user } = data ?? {};
  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };
  const onClick = cancelVariant === "reject" ? handleReject : handleCancel;
  return (
    <div className="flex w-full flex-col border-b border-gray-300/20  sm:px-10 md:px-24 lg:px-32">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold -tracking-[0.0375rem]">{title}</h1>
        <div className="flex items-center space-x-2 text-sm sm:flex-row">
          <Button
            size="sm"
            variant={cancelVariant === "reject" ? "destructive" : "primary-outline"}
            onClick={onClick}
          >
            {cancelVariant === "cancel" && "Cancel"}
            {cancelVariant === "reject" && "Reject"}
          </Button>

          <Button form={id} size="sm" type="submit">
            {ME_DATA.role.type === "contributor" && "Continue"}
            {ME_DATA.role.type === "admin" && isNew && "Submit"}
            {ME_DATA.role.type === "admin" && !isNew && "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFormControls;
