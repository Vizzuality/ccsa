"use client";

import ApproveChangesFormLegend from "@/containers/datasets/changes-to-approve/approve-changes-form-legend";

import DatasetDataForm, { Change } from "@/components/forms/dataset/data";
import type { Data } from "@/components/forms/dataset/types";

export default function DataContentToApprove({
  data,
  id,
  isNewDataset,
  changes,
  handleSubmit,
}: {
  data: Data;
  id: string;
  isNewDataset: boolean;
  changes: string[] | Change[];
  handleSubmit: (data: Data["data"]) => void;
}) {
  return (
    <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="flex w-full justify-between space-x-10">
        <ApproveChangesFormLegend
          changes={changes}
          isNewDataset={isNewDataset}
          status={data?.settings?.review_status}
        />

        <div className="w-full min-w-fit max-w-5xl flex-1 gap-4">
          <DatasetDataForm
            id={id}
            header={false}
            title={`${data?.settings?.name} - Edit` || "Edit dataset"}
            data={data}
            onSubmit={handleSubmit}
            changes={changes}
          />
        </div>
      </div>
    </div>
  );
}
