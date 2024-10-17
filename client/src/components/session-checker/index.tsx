"use client";

import { PropsWithChildren, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import { privatePaths } from "@/middleware";
import { usePathname } from "next/navigation";

export default function SessionChecker({ children }: PropsWithChildren) {
  const { data: sessionData } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (!!sessionData?.error) {
      // Check if the current path is part of private paths
      const isPrivatePath = privatePaths.includes(pathname);

      // Sign out user and redirect them to signin page if needed
      signOut({
        callbackUrl: isPrivatePath ? "/signin" : undefined, // Only add callbackUrl for private paths
      });
    }
  }, [sessionData, pathname]);

  return <>{children}</>;
}
