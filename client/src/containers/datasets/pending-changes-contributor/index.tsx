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

export default function DatasetPendingChangesContributor() {
  const { data: suggestions } = useGetDatasetEditSuggestions();

  const data = suggestions?.data;

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Pending changes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Change type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((suggestion) => (
            <Link
              key={suggestion?.attributes?.createdAt}
              href={`/datasets/changes-to-approve/${suggestion?.id}`}
            >
              <TableRow>
                <TableCell className="whitespace-nowrap font-medium">Dataset </TableCell>
                <TableCell>{suggestion?.attributes?.name}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {suggestion?.attributes?.createdAt &&
                    formatDate(suggestion?.attributes?.createdAt)}
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
