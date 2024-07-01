"use client";

import Link from "next/link";

import { cn } from "@/lib/classnames";
import { formatDate } from "@/lib/utils/formats";

import { useGetCollaboratorEditSuggestions } from "@/types/generated/collaborator-edit-suggestion";
import { useGetDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import { useGetProjectEditSuggestions } from "@/types/generated/project-edit-suggestion";
import type {
  DatasetEditSuggestionListResponseDataItem,
  ToolEditSuggestionListResponseDataItem,
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

type DataTypes = {
  [key: string]: {
    label: string;
    data:
      | DatasetEditSuggestionListResponseDataItem[]
      | ToolEditSuggestionListResponseDataItem[]
      | undefined;
    route: "datasets/changes-to-approve" | "other-tools" | "collaborators" | "projects";
  };
};

export default function DatasetPendingChangesContributor() {
  const { data: datasetsDataSuggestions } = useGetDatasetEditSuggestions();
  const { data: otherToolDataSuggestions } = useGetToolEditSuggestions();
  const { data: collaboratorsDataSuggestions } = useGetCollaboratorEditSuggestions();
  const { data: projectsDataSuggestions } = useGetProjectEditSuggestions();

  const data: DataTypes = {
    datasets: {
      label: "Datasets",
      route: "datasets/changes-to-approve",
      data: datasetsDataSuggestions?.data,
    },
    otherTools: {
      label: "Tools",
      route: "other-tools",
      data: otherToolDataSuggestions?.data,
    },
    collaborators: {
      label: "Collaborator",
      route: "collaborators",
      data: collaboratorsDataSuggestions?.data,
    },
    projects: {
      label: "Project",
      route: "projects",
      data: projectsDataSuggestions?.data,
    },
  };

  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Pending changes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] whitespace-nowrap">Change type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(data).map(
            (key) =>
              data[key]?.data?.map((suggestion) => {
                return (
                  <TableRow key={suggestion?.attributes?.createdAt}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <Link
                        href={`/dashboard/${data[key].route}/${suggestion?.id}`}
                        className="flex w-full"
                      >
                        {data[key].label}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/dashboard/${data[key].route}/${suggestion?.id}`}
                        className="flex w-full"
                      >
                        {suggestion.attributes?.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/dashboard/${data[key].route}/${suggestion?.id}`}
                        className="flex w-full"
                      >
                        <span
                          className={cn({
                            "rounded-sm border px-2.5 py-1": true,
                            "border-green-300 border-opacity-30 bg-green-300 bg-opacity-20 text-green-400":
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
                      <Link
                        href={`/dashboard/datasets/changes-to-approve/${suggestion?.id}`}
                        className="flex w-full"
                      >
                        {suggestion?.attributes?.createdAt &&
                          formatDate(suggestion?.attributes?.createdAt)}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              }),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
