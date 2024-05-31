"use client";

import env from "@/env.mjs";

import { useSyncSearchParams } from "@/app/store";

const EmbedContent = () => {
  const searchParams = useSyncSearchParams();

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg">Map embed</h3>

      <pre className="whitespace-pre-line break-all bg-gray-50 p-2 text-xs">{`<iframe src={"${
        env.NEXT_PUBLIC_URL
      }/embed?${searchParams.toString()}"} width="800px" height="600px" />
    `}</pre>
    </div>
  );
};

export default EmbedContent;
