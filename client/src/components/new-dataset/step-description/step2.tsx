import React, { useRef } from "react";

import { useDropzone } from "react-dropzone";

import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";

import { datasetValuesJsonUploadedAtom } from "@/app/store";

import { validateCsv } from "@/services/datasets";

export default function Step2() {
  const setDatasetValues = useSetAtom(datasetValuesJsonUploadedAtom);
  const fileInputRef = useRef(null);

  const { data: session } = useSession();
  const apiToken = session?.apiToken;

  const { getInputProps, getRootProps } = useDropzone({
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDropAccepted(files) {
      if (files.length > 0) {
        validateCsv(files, {
          Authorization: `Bearer ${apiToken}`,
        }).then(({ data }) => {
          setDatasetValues(data);
        });
      }
    },
  });

  return (
    <div className="flex space-x-2 text-xs font-light">
      <div {...getRootProps()}>
        <span>Add data manually or </span>
        <span className="cursor-pointer text-xs text-primary underline">
          import a CSV
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            {...getInputProps()}
          />
        </span>
      </div>
    </div>
  );
}
