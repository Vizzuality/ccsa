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
import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";

export default function NewDatasetForm() {
  const { replace } = useRouter();
  const [currentStep] = useAtom(datasetFormStepAtom);
  const [newDatasetForm, setFormValues] = useState({
    settings: {},
    data: {},
    colors: {},
  });

  const { mutate } = usePostDatasets({
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

  const { mutate: mutateDatasetEditSuggestion } = usePostDatasetEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.log("Success creating dataset:", data);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    // const fieldsToUpdate = form.formState.dirtyFields;

    mutate({ data: { email: values.email } });
  }

  const handleDataset = () => {
    mutateDatasetEditSuggestion({
      data: {
        data: {
          datum: [
            {
              iso3: "ABW",
              value: 8.069999694824219,
            },
            {
              iso3: "AIA",
              value: 9.59000015258789,
            },
            {
              iso3: "ATG",
              value: 4.829999923706055,
            },
            {
              iso3: "BES",
              value: 5.139999866485596,
            },
            {
              iso3: "BHS",
              value: 6.130000114440918,
            },
            {
              iso3: "BLZ",
              value: 1.7699999809265137,
            },
            {
              iso3: "BMU",
              value: 8.569999694824219,
            },
            {
              iso3: "BRB",
              value: 3.9200000762939453,
            },
            {
              iso3: "CRI",
              value: 1.5499999523162842,
            },
            {
              iso3: "CUW",
              value: 11.899999618530273,
            },
            {
              iso3: "CYM",
              value: 7.019999980926514,
            },
            {
              iso3: "DMA",
              value: 2.2100000381469727,
            },
            {
              iso3: "DOM",
              value: 2.690000057220459,
            },
            {
              iso3: "GLP",
              value: 5.650000095367432,
            },
            {
              iso3: "GRD",
              value: 2.8499999046325684,
            },
            {
              iso3: "GUY",
              value: 3.940000057220459,
            },
            {
              iso3: "HND",
              value: 1.1200000047683716,
            },
            {
              iso3: "HTI",
              value: 0.25999999046325684,
            },
            {
              iso3: "JAM",
              value: 2.609999895095825,
            },
            {
              iso3: "KNA",
              value: 4.5,
            },
            {
              iso3: "LCA",
              value: 2.6600000858306885,
            },
            {
              iso3: "MEX",
              value: 3.2300000190734863,
            },
            {
              iso3: "MSR",
              value: 3.5,
            },
            {
              iso3: "PAN",
              value: 3.069999933242798,
            },
            {
              iso3: "SUR",
              value: 4.800000190734863,
            },
            {
              iso3: "TCA",
              value: 7.659999847412109,
            },
            {
              iso3: "TTO",
              value: 25.899999618530273,
            },
            {
              iso3: "VCT",
              value: 2.130000114440918,
            },
            {
              iso3: "VGB",
              value: 5.28000020980835,
            },
            {
              iso3: "VIR",
              value: 21.049999237060547,
            },
          ],
          description: "test dataset description",
          name: "test 3 dataset name",
          review_status: "declined",
          unit: "",
          value_type: "text",
        },
      },
    });
  };

  return (
    <>
      <button onClick={handleDataset}>Create dataset</button>
      {currentStep === 1 && (
        <NewDatasetSettingsForm data={newDatasetForm} onClick={setFormValues} />
      )}
      {currentStep === 2 && <NewDatasetDataForm data={newDatasetForm} onClick={setFormValues} />}
      {currentStep === 3 && <NewDatasetColorsForm data={newDatasetForm} onClick={setFormValues} />}
    </>
  );
}
