"use client";

import { formatDate } from "@/lib/utils/formats";

import {
  extendedCollaboratorData,
  extendedDataset,
  extendedProjectData,
  extendedToolData,
} from "@/components/forms/dataset/types";
import { TableCell, TableRow } from "@/components/ui/table";

type ApprovedProps =
  | extendedDataset
  | extendedToolData
  | extendedCollaboratorData
  | extendedProjectData;

export default function ApprovedContributorsRow(data: ApprovedProps) {
  return (
    <TableRow key={data.createdAt}>
      <TableCell className="whitespace-nowrap font-medium">
        <div className="flex w-full">{data.label}</div>
      </TableCell>
      <TableCell className="whitespace-nowrap font-medium">
        <div>{data.name}</div>
      </TableCell>
      <TableCell>
        <span className="border-opacity310 rounded-sm border border-green-300 bg-green-300 bg-opacity-20 px-2.5 py-1 text-green-400">
          {data.review_status}
        </span>
      </TableCell>
      <TableCell>
        <div
          className="flex w-full whitespace-nowrap"
          title={data?.reviewed_by?.data?.attributes?.email}
        >
          {data.review_status === "pending" ? "-" : data?.reviewed_by?.data?.attributes?.username}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex w-full whitespace-nowrap">
          {data.updatedAt && data.createdAt && formatDate(data.updatedAt)}
          {!data.updatedAt && data.createdAt && formatDate(data.createdAt)}
        </div>
      </TableCell>
    </TableRow>
  );
}
