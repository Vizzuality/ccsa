"use client";

import Link from "next/link";

import { cn } from "@/lib/classnames";
import { formatDate } from "@/lib/utils/formats";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  extendedToolData,
  extendedDataset,
  extendedCollaboratorData,
  extendedProjectData,
} from "@/components/forms/dataset/types";

type PendingChangesCell =
  | extendedDataset
  | extendedToolData
  | extendedCollaboratorData
  | extendedProjectData;

export default function PendingDeclinedChangesContributorRow(data: PendingChangesCell) {
  return (
    <TableRow key={data.createdAt}>
      <TableCell className="whitespace-nowrap font-medium">
        <Link href={`/dashboard/${data.route}/${data.id}`} className="flex w-full">
          {data.label}
        </Link>
      </TableCell>
      <TableCell className="whitespace-nowrap font-medium">
        <Link href={`/dashboard/${data.route}/${data.id}`}>{data.name}</Link>
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/${data.route}/${data.id}`} className="flex w-full">
          <span
            className={cn({
              "rounded-sm border px-2.5 py-1": true,

              "border-primary bg-primary/10 text-primary": data.review_status === "pending",
              "border-red-500 text-red-500": data.review_status === "declined",
            })}
          >
            {data.review_status}
          </span>
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/dashboard/${data.route}/${data.id}`}
          className="flex w-full whitespace-nowrap"
        >
          {data.updatedAt && data.createdAt && formatDate(data.updatedAt)}
          {!data.updatedAt && data.createdAt && formatDate(data.createdAt)}
        </Link>
      </TableCell>
    </TableRow>
  );
}
