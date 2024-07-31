"use client";

import Link from "next/link";

import { cn } from "@/lib/classnames";
import { formatDate } from "@/lib/utils/formats";

import { useGetCollaboratorEditSuggestions } from "@/types/generated/collaborator-edit-suggestion";
import { useGetDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import { useGetProjectEditSuggestions } from "@/types/generated/project-edit-suggestion";
import type {
  DatasetEditSuggestion,
  ToolEditSuggestion,
  ProjectEditSuggestion,
  CollaboratorEditSuggestion,
} from "@/types/generated/strapi.schemas";
import { useGetToolEditSuggestions } from "@/types/generated/tool-edit-suggestion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTypes, Label, Route } from "@/components/forms/dataset/types";

export default function PendingChangesAdmin() {
  const { data: datasetsDataSuggestions } = useGetDatasetEditSuggestions({
    populate: "*",
  });
  const { data: otherToolDataSuggestions } = useGetToolEditSuggestions({
    populate: "*",
  });
  const { data: collaboratorsDataSuggestions } = useGetCollaboratorEditSuggestions({
    populate: "*",
  });
  const { data: projectsDataSuggestions } = useGetProjectEditSuggestions({
    populate: "*",
  });

  const data: DataTypes = [
    ...(datasetsDataSuggestions?.data?.map(({ id, attributes }) => ({
      id,
      ...attributes,
      review_status: attributes?.review_status || "pending",
      label: "Datasets" as Label,
      route: "datasets/changes-to-approve" as Route,
    })) || []),

    ...(otherToolDataSuggestions?.data?.map(({ id, attributes }) => ({
      id,
      ...attributes,
      review_status: attributes?.review_status || "pending",
      label: "Tool" as Label,
      route: "other-tools" as Route,
    })) || []),

    ...(collaboratorsDataSuggestions?.data?.map(({ id, attributes }) => ({
      id,
      ...attributes,
      review_status: attributes?.review_status || "pending",
      label: "Collaborator" as Label,
      route: "collaborators" as Route,
    })) || []),

    ...(projectsDataSuggestions?.data?.map(({ id, attributes }) => ({
      id,
      ...attributes,
      review_status: attributes?.review_status || "pending",
      label: "Project" as Label,
      route: "projects" as Route,
    })) || []),
  ];

  function orderAndFlattenData(data: DataTypes): DataTypes {
    const statusOrder = ["pending", "approved", "declined"];

    return data.sort((a, b) => {
      const statusComparison =
        statusOrder.indexOf(a.review_status) - statusOrder.indexOf(b.review_status);
      if (statusComparison !== 0) {
        return statusComparison;
      }

      const dateA = new Date(a.updatedAt || 0);
      const dateB = new Date(b.updatedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  const orderedData = orderAndFlattenData(data);

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Change type</TableHead>
            <TableHead className="w-[100px]">name</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedData.map((d) => (
            <TableRow key={d.createdAt}>
              <TableCell className="whitespace-nowrap font-medium">
                <Link href={`/dashboard/${d.route}/${d.id}`} className="flex w-full">
                  {d.label}
                </Link>
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium">
                <Link href={`/dashboard/${d.route}/${d.id}`}>{d.name}</Link>
              </TableCell>
              <TableCell className="w-full">
                <Link href={`/dashboard/${d.route}/${d.id}`} className="w-full">
                  {d.author?.data?.attributes?.email}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/datasets/changes-to-approve/${d.id}`}
                  className="flex w-full"
                >
                  <span
                    className={cn({
                      "rounded-sm border px-2.5 py-1": true,
                      "border-opacity310 border-green-300 bg-green-300 bg-opacity-20 text-green-400":
                        d.review_status === "approved",
                      "border-primary bg-primary/10 text-primary": d.review_status === "pending",
                      "border-red-500 text-red-500": d.review_status === "declined",
                    })}
                  >
                    {d.review_status}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/${d.route}/${d.id}`}
                  className="flex w-full whitespace-nowrap"
                >
                  {d.updatedAt && d.createdAt && formatDate(d.updatedAt)}
                  {!d.updatedAt && d.createdAt && formatDate(d.createdAt)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
