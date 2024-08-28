import React, { useCallback, useRef } from "react";

import { useDropzone } from "react-dropzone";

import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { LuInfo } from "react-icons/lu";

import { useRouter } from "next/navigation";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import { downloadCSV } from "@/lib/utils/csv";
import { UsersPermissionsRole, UsersPermissionsUser } from "@/types/generated/strapi.schemas";
import { datasetValuesJsonUploadedAtom } from "@/app/store";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { validateDatasetValuesCsv } from "@/services/datasets";

import { uploadProjectsCsv, uploadProjectsSuggestionCsv } from "@/services/projects";
import CSVInfoContent from "./csv-info-content";

import type { CSVImportTypes } from "./types";
import { uploadCollaboratorsCsv } from "@/services/collaborators";
import { uploadOtherToolsCsv, uploadOtherToolsSuggestionCsv } from "@/services/other-tools";

export default function CSVImport({
  valueType,
  values,
}: {
  valueType: CSVImportTypes;
  values: any;
}) {
  const { push } = useRouter();
  const setDatasetValues = useSetAtom(datasetValuesJsonUploadedAtom);
  const fileInputRef = useRef(null);

  const { data: session } = useSession();
  const apiToken = session?.apiToken;

  const user = session?.user;

  const { data: meData } = useGetUsersId(`${user?.id}`, {
    populate: "role",
  });

  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  const { getInputProps, getRootProps } = useDropzone({
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDropAccepted(files) {
      if (files.length > 0) {
        if (
          valueType === "boolean" ||
          valueType === "number" ||
          valueType === "text" ||
          valueType === "resource"
        ) {
          validateDatasetValuesCsv(files, {
            Authorization: `Bearer ${apiToken}`,
          }).then(({ data }) => {
            setDatasetValues(data);
          });
        }
        if (valueType === "project") {
          ME_DATA?.role?.type === "admin" &&
            uploadProjectsCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/projects");
            });
          ME_DATA?.role?.type === "authenticated" &&
            uploadProjectsSuggestionCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/dashboard");
            });
        }
        if (valueType === "collaborators") {
          ME_DATA?.role?.type === "admin" &&
            uploadCollaboratorsCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/collaborators");
            });
          ME_DATA?.role?.type === "authenticated" &&
            uploadProjectsSuggestionCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/dashboard");
            });
        }
        if (valueType === "other-tools") {
          ME_DATA?.role?.type === "admin" &&
            uploadOtherToolsCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/other-tools");
            });
          ME_DATA?.role?.type === "authenticated" &&
            uploadOtherToolsSuggestionCsv(files, {
              Authorization: `Bearer ${apiToken}`,
            }).then(() => {
              push("/dashboard");
            });
        }
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
