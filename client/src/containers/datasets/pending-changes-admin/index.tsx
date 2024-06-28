"use client";

import Link from "next/link";

import { cn } from "@/lib/classnames";
import { formatDate } from "@/lib/utils/formats";

import { useGetDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DatasetPendingChangesAdmin() {
  const { data: suggestions } = useGetDatasetEditSuggestions({
    populate: "*",
  });

  const data = suggestions?.data;

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Change name</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((suggestion) => (
            <TableRow key={suggestion?.attributes?.createdAt}>
              <TableCell className="whitespace-nowrap font-medium">
                <Link href={`/dashboard/datasets/changes-to-approve/${suggestion.id}`}>
                  {suggestion?.attributes?.name}
                </Link>
              </TableCell>
              <TableCell className="w-full">
                <Link
                  href={`/dashboard/datasets/changes-to-approve/${suggestion.id}`}
                  className="w-full"
                >
                  {suggestion?.attributes?.author?.data?.attributes?.email} -{" "}
                  {suggestion?.attributes?.author?.data?.attributes?.organization}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/datasets/changes-to-approve/${suggestion?.id}`}
                  className="flex w-full"
                >
                  <span
                    className={cn({
                      "rounded-sm border px-2.5 py-1": true,
                      "border-opacity310 border-green-300 bg-green-300 bg-opacity-20 text-green-400":
                        suggestion.attributes?.review_status === "approved",
                      "border-primary bg-primary/10 text-primary":
                        suggestion.attributes?.review_status === "pending",
                      "border-red-500 text-red-500":
                        suggestion?.attributes?.review_status === "declined",
                    })}
                  >
                    {suggestion.attributes?.review_status}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/datasets/changes-to-approve/${suggestion.id}`}>
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
