"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: user } = useSession();
  const { replace } = useRouter();

  if (!user) {
    replace("/signin");
  }

  return <div className="relative z-10 h-full w-full "></div>;
}
