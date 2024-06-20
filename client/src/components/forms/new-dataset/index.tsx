"use client";

import { useState } from "react";

import { isEmpty } from "lodash-es";
import { useFormContext } from "react-hook-form";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { useAtom } from "jotai";
import { datasetFormStepAtom } from "@/app/store";

import NewDatasetColorsForm from "@/components/forms/new-dataset/colors";
import NewDatasetDataForm from "@/components/forms/new-dataset/data";
import NewDatasetSettingsForm from "@/components/forms/new-dataset/settings";
import { usePostDatasets } from "@/types/generated/dataset";
import { usePostAuthForgotPassword } from "@/types/generated/users-permissions-auth";

export default function NewDatasetForm() {
  const { replace } = useRouter();
  const [currentStep] = useAtom(datasetFormStepAtom);
  const [newDatasetForm, setFormValues] = useState({
    settings: {},
    data: {},
    colors: {},
  });

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: (data) => {
        console.log("Success creating dataset:", data);
        const searchParams = new URLSearchParams();
        replace(`/signin?${searchParams.toString()}`);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    // const fieldsToUpdate = form.formState.dirtyFields;

    mutate({ data: { email: values.email } });
  }
  return (
    <>
      {currentStep === 1 && (
        <NewDatasetSettingsForm data={newDatasetForm} onClick={setFormValues} />
      )}
      {currentStep === 2 && <NewDatasetDataForm data={newDatasetForm} onClick={setFormValues} />}
      {currentStep === 3 && <NewDatasetColorsForm data={newDatasetForm} onClick={setFormValues} />}
    </>
  );
}
