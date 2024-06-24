"use client";

import Link from "next/link";

import { useSession } from "next-auth/react";

import { useSyncDatasets } from "@/app/store";

const DatasetsHeader = () => {
  const [datasets] = useSyncDatasets();

  const session = useSession();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm">All datasets</p>

        {!!session && (
          <Link
            href="/datasets/new"
            className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-transparent px-2.5 text-[10px] text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          >
            Add new
          </Link>
        )}
      </div>
      <div className="flex translate-y-0.5 items-center space-x-1.5 text-xxs">
        <span className="font-semibold uppercase text-gray-400">Active layers:</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-semibold">
          {datasets.length}
        </span>
      </div>
    </header>
  );
};

export default DatasetsHeader;
