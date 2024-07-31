"use client";

import { useGetCollaboratorEditSuggestions } from "@/types/generated/collaborator-edit-suggestion";
import { useGetDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
import { useGetProjectEditSuggestions } from "@/types/generated/project-edit-suggestion";

import { useGetToolEditSuggestions } from "@/types/generated/tool-edit-suggestion";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DataTypes, Label, Route } from "@/components/forms/dataset/types";

import PendingDeclinedChangesRow from "./pending-declined-changes-row";
import ApprovedChangesRow from "./approved-changes-row";

export default function PendingChangesContributor() {
  const { data: datasetsDataSuggestions } = useGetDatasetEditSuggestions();
  const { data: otherToolDataSuggestions } = useGetToolEditSuggestions();
  const { data: collaboratorsDataSuggestions } = useGetCollaboratorEditSuggestions();
  const { data: projectsDataSuggestions } = useGetProjectEditSuggestions();
  const data: DataTypes = [
    ...(datasetsDataSuggestions?.data?.map(({ id, attributes }) => ({
      id,
      ...attributes,
      review_status: attributes?.review_status || "pending",
      label: "Datasets" as Label,
      route: "datasets/edit" as Route,
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
      <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Suggested updates</h1>
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
          {!!orderedData.length &&
            orderedData.map((d) => {
              if (d.review_status !== "approved") {
                return <PendingDeclinedChangesRow key={d.id} {...d} />;
              } else {
                return <ApprovedChangesRow key={d.id} {...d} />;
              }
            })}
        </TableBody>
      </Table>
    </div>
  );
}
