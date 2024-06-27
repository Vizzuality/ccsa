"use client";

import ApproveChangesFormLegend from "@/containers/datasets/changes-to-approve/approve-changes-form-legend";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import type { Data } from "@/components/forms/new-dataset/types";

export default function ColorsContentToApprove({
  data,
  id,
  isNewDataset,
  changes,
  handleSubmit,
}: {
  data: Data;
  id: string;
  isNewDataset: boolean;
  changes: string[];
  handleSubmit: (data: Data["colors"]) => void;
}) {
  return (
    <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="flex w-full justify-between space-x-10">
        <ApproveChangesFormLegend changes={changes} isNewDataset={isNewDataset} />

        <div className="flex w-full flex-1">
          <NewDatasetColorsForm
            id={id}
            header={false}
            title={`${data?.settings?.name} - Edit` || "Edit dataset"}
            data={data}
            changes={changes}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
