"use client";

import { Change } from "@/components/forms/dataset/data";

export default function ApproveChangesFormLegend({
  isNewDataset,
  changes,
  status,
  message,
}: {
  isNewDataset: boolean;
  changes: string[] | Change[];
  status?: "approved" | "pending" | "declined";
  message?: string;
}) {
  return (
    <div className="flex w-full max-w-[368px] flex-1 flex-col justify-start">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          {!isNewDataset && status !== "declined" && <span className="h-4 w-4 bg-green-400" />}
          {!isNewDataset && status !== "declined" && <span>New changes</span>}
          {isNewDataset && status !== "declined" && <span>Changes pending to be approved</span>}
          {status === "declined" && (
            <div className="space-y-5">
              <span className="rounded-sm border border-red-500 px-2.5 py-1 text-red-500">
                Declined
              </span>
              {message && <p className="first-letter:uppercase">{message}</p>}
            </div>
          )}
        </div>
        {!isNewDataset && status !== "declined" && (
          <p>
            {changes?.length > 0
              ? "Changes summary. Please see the attached recommended edit. If any further changes are required to complete the submission and make it ready for upload, please make the adjustments here."
              : "No changes has been applied."}
          </p>
        )}
      </div>
    </div>
  );
}
