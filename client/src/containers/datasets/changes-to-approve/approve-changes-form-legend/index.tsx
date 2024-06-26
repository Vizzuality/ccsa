"use client";

export default function ApproveChangesFormLegend({
  isNewDataset,
  changes,
}: {
  isNewDataset: boolean;
  changes: string[];
}) {
  return (
    <div className="flex w-full max-w-[368px] flex-1 flex-col justify-start">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          {isNewDataset && <span className="h-4 w-4 bg-green-400" />}
          {!isNewDataset && <span>New changes</span>}
          {isNewDataset && <span>Changes pending to be approved</span>}
        </div>
        {!isNewDataset && (
          <p>
            {changes?.length > 0
              ? "Changes summary. Lorem ipsum dolor sit amet consectetur. Sit cursus sit pellentesque amet pellentesque tellus. Elit aliquam nec viverra egestas id ipsum vitae."
              : "No changes has been applied."}
          </p>
        )}
      </div>
    </div>
  );
}
