"use client";

import Link from "next/link";

import { useSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";

import { formatDate } from "@/lib/utils/formats";

export default function DatasetPendingChangesAdmin() {
  const { data: suggestions } = useGetDatasetEditSuggestions();

  const { data: session } = useSession();

  const data = suggestions?.data;

  console.log(data);

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Change name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((suggestion) => (
            <TableRow key={suggestion?.attributes?.createdAt}>
              <TableCell className="whitespace-nowrap font-medium">
                <Link href={`/datasets/changes-to-approve/${suggestion.id}`}>
                  {suggestion?.attributes?.name}
                </Link>
              </TableCell>
              <TableCell className="w-full">
                <Link href={`/datasets/changes-to-approve/${suggestion.id}`} className="w-full">
                  {session?.user?.organization || "-"}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/datasets/changes-to-approve/${suggestion.id}`}>
                  {suggestion?.attributes?.createdAt &&
                    formatDate(suggestion?.attributes?.createdAt)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
