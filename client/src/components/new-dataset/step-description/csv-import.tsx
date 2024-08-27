import React, { useCallback, useRef } from "react";

import { useDropzone } from "react-dropzone";

import { useSetAtom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { LuInfo } from "react-icons/lu";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { downloadCSV } from "@/lib/utils/csv";

import { datasetValuesJsonUploadedAtom } from "@/app/store";
import { Dataset } from "@/types/generated/strapi.schemas";

import { validateCsv } from "@/services/datasets";
import CSVInfoContent from "./csv-info-content";

export default function CSVImport({
  valueType,
  values,
}: {
  valueType: Dataset["value_type"];
  values: any;
}) {
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

  const handleDownload = useCallback(() => {
    downloadCSV(values?.data, valueType, "myData.csv");
  }, [values?.data, valueType]);

  return (
    <div className="flex justify-between text-xs font-light">
      <div className="flex items-center">
        <div {...getRootProps()}>
          <span>Add data manually or </span>
          <span className="cursor-pointer text-primary underline">
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
        <Dialog>
          <DialogTrigger onClick={(e) => e.stopPropagation()}>
            <LuInfo className="mb-2.5 h-5 w-5 pl-1 font-bold text-primary" />
          </DialogTrigger>

          <DialogContent>
            <CSVInfoContent valueType={valueType} />
          </DialogContent>
        </Dialog>
      </div>
      <button onClick={handleDownload} className="text-primary underline">
        Download template
      </button>
    </div>
  );
}
