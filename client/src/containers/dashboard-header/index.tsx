"use client";

import Image from "next/image";
import Link from "next/link";

import { useSession, signOut } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { useSyncSearchParams } from "@/app/store";

import { buttonVariants } from "@/components/ui/button";

const DashboardHeader = (): JSX.Element => {
  const { data: session } = useSession();

  const URLparams = useSyncSearchParams();

  return (
    <div className="relative z-20 m-auto flex h-24 w-full justify-between bg-white p-4 sm:px-10 md:px-24 lg:px-32">
      <Link className="flex flex-col items-center justify-center gap-1" href="/">
        <Image priority alt="CCSA Logo" width={72} height={59} src="/logo.svg" />
      </Link>
      <div className="flex flex-col items-center space-x-4 text-sm sm:flex-row">
        <div className="flex items-center text-sm sm:space-x-2">
          <span>{session?.user.email}</span>
          <button className="flex items-center pl-2 font-semibold text-primary sm:space-x-2">
            <span className="hidden sm:block" onClick={() => signOut()}>
              Log out
            </span>
            <LuLogOut />
          </button>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "default" }))}
          href={`/?${decodeURIComponent(URLparams.toString())}`}
        >
          Open Map
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
