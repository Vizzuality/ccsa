"use client";

import { useSession } from "next-auth/react";

import Link from "next/link";

export default function CollaboratorsTitle() {
  const session = useSession();
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-metropolis text-3xl tracking-tight text-gray-700">Collaborators</h1>
      {session.status === "authenticated" && (
        <Link
          href="/other-tools-edit"
          className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
        >
          Add new
        </Link>
      )}
    </div>
  );
}
