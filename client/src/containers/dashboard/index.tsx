"use client";

import dynamic from "next/dynamic";

import { useSession } from "next-auth/react";

import type { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

export default function DashboardContent() {
  const { data: session } = useSession();
  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });

  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const role = ME_DATA?.role?.type || "admin";

  const DynamicContent = dynamic(() => import(`@/containers/dashboard/${role}`), {
    ssr: false,
  });

  return (
    <div>
      <DynamicContent />
    </div>
  );
}
