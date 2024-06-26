"use client";

import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
import { Data } from "@/components/forms/new-dataset/types";

export default function SettingsContentToApprove({
  data,
  id,
  changes,
  handleSubmit,
}: {
  data: Data;
  id: string;
  changes: string[];
  handleSubmit: (data: Data["settings"]) => void;
}) {
  return (
    <div className="flex items-center py-10 sm:px-10 md:px-24 lg:px-32">
      <div className="flex w-full justify-between space-x-10">
        <div className="flex w-full max-w-[368px] flex-1 flex-col justify-start">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 bg-green-400" />
              <span>New changes</span>
            </div>
            <p>
              {changes?.length > 0
                ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
                : "No changes has been applied."}
            </p>
          </div>
        </div>

        <NewDatasetSettingsForm
          id={id}
          title={data?.settings?.name}
          data={data}
          header={false}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
