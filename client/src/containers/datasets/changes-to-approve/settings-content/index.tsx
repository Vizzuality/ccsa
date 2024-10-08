"use client";

import ApproveChangesFormLegend from "@/containers/datasets/changes-to-approve/approve-changes-form-legend";

import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

export default function SettingsContentToApprove({
  data,
  id,
  isNewDataset,
  changes,
  handleSubmit,
  status,
  message,
}: {
  data: Data;
  id: string;
  isNewDataset: boolean;
  changes: string[];
  handleSubmit: (data: Data["settings"]) => void;
  status: "approved" | "pending" | "declined" | undefined;
  message?: string;
}) {
  return (
    <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="flex w-full justify-between space-x-10">
        <ApproveChangesFormLegend
          changes={changes}
          isNewDataset={isNewDataset}
          status={status}
          message={message}
        />

        <DatasetSettingsForm
          id={id}
          title={data?.settings?.name}
          data={data}
          header={false}
          onSubmit={handleSubmit}
          changes={changes}
          status={status}
        />
      </div>
    </div>
  );
}
