"use client";

import { useState } from "react";

import env from "@/env.mjs";

import { useSyncSearchParams } from "@/app/store";

import { Button } from "@/components/ui/button";

const EmbedContent = () => {
  const searchParams = useSyncSearchParams();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg">Map embed</h3>

      <div className="space-y-1">
        <h4 className="font-display text-sm">url</h4>
        <pre className="whitespace-pre-line break-all bg-gray-50 p-2 text-xs">{`${
          env.NEXT_PUBLIC_URL
        }/embed?${searchParams.toString()}`}</pre>

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `${env.NEXT_PUBLIC_URL}/embed?${searchParams.toString()}`,
              );
              setCopiedUrl(true);
              setTimeout(() => setCopiedUrl(false), 3000);
            }}
          >
            {copiedUrl ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-display text-sm">iframe</h4>
        <pre className="whitespace-pre-line break-all bg-gray-50 p-2 text-xs">{`<iframe src="${
          env.NEXT_PUBLIC_URL
        }/embed?${searchParams.toString()}" width="800px" height="600px" />
      `}</pre>

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `<iframe src={"${
                  env.NEXT_PUBLIC_URL
                }/embed?${searchParams.toString()}"} width="800px" height="600px" />`,
              );
              setCopiedIframe(true);
              setTimeout(() => setCopiedIframe(false), 3000);
            }}
          >
            {copiedIframe ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmbedContent;
