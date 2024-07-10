"use client";

import { useCallback } from "react";

// import { usePostDatasets } from "@/types/generated/dataset";
import { useRouter } from "next/navigation";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";

import { usePostDatasetEditSuggestions } from "@/types/generated/dataset-edit-suggestion";
// import { usePostDatasetValues } from "@/types/generated/dataset-value";
import type {
  UsersPermissionsRole,
  UsersPermissionsUser,
  DatasetValueType,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { datasetStepAtom, datasetValuesAtom } from "@/app/store";

import DatasetColorsForm from "@/components/forms/dataset/colors";
import DatasetDataForm from "@/components/forms/dataset/data";
import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

import { updateOrCreateDataset } from "@/hooks";

import { PARAMS_CONFIG, DEFAULT_COLOR } from "./constants";

type Colors = { [key: string]: string };

const getLegendConfigNumber = (colors: Colors, minValue: number, maxValue: number) => {
  return {
    type: "gradient",
    items: [
      {
        color: colors.min,
        label: minValue,
        value: minValue,
      },
      {
        color: colors.max,
        label: maxValue,
        value: maxValue,
      },
    ],
  };
};

const getLegendConfigBoolean = (colors: Colors) => {
  return {
    type: "basic",
    items: [
      {
        color: colors.yes,
        label: "yes",
        value: "yes",
      },
      {
        color: colors.no,
        label: "no",
        value: "no",
      },
    ],
  };
};

const getLegendConfigText = (data: Data["data"], colors: Colors) => {
  const categories = [...new Set(Object.values(data))].filter(
    (item) => item !== undefined,
  ) as string[];

  return {
    type: "basic",
    items: categories.map((category) => ({
      color: colors[category],
      label: category,
      value: category,
    })),
  };
};

const getLegendConfigResources = (colors: Colors) => {
  return {
    type: "gradient",
    items: [
      {
        color: colors.min,
        label: "@@#params.minValue",
        value: "@@#params.minValue",
      },
      {
        color: colors.max,
        label: "@@#params.maxValue",
        value: "@@#params.maxValue",
      },
    ],
  };
};

const getNumberData = (data: Data) => {
  const { category, ...restSettings } = data.settings;
  const datasetValues = getTransformedData(data.data, "number");

  const items = Object.values(data.data);
  const values = items.filter((item) => item !== null && !!item) as number[];
  // Find the min and max values
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const fillColor = createFillColorExpression(data, minValue, maxValue);
  const configText = {
    styles: [
      {
        id: data.settings.name,
        type: "fill",
        paint: {
          "fill-color": fillColor,
          "fill-opacity": "@@#params.opacity",
        },
        layout: {
          visibility: {
            v: "@@#params.visibility",
            "@@function": "setVisibility",
          },
        },
      },
    ],
  };

  const layers = [
    {
      name: data.settings.name,
      type: "countries",
      config: configText,
      params_config: PARAMS_CONFIG,
      legend_config: getLegendConfigNumber(data.colors, minValue, maxValue),
      interaction_config: {},
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.valueType,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

const getTextData = (data: Data) => {
  const { category, ...restSettings } = data.settings;
  const datasetValues = getTransformedData(data.data, "text");

  const fillColor = transformToMatchExpression(data.colors);
  const configText = {
    styles: [
      {
        id: data.settings.name,
        type: "fill",
        paint: {
          "fill-color": fillColor,
          "fill-opacity": "@@#params.opacity",
        },
        layout: {
          visibility: {
            v: "@@#params.visibility",
            "@@function": "setVisibility",
          },
        },
      },
    ],
  };

  const layers = [
    {
      name: data.settings.name,
      type: "countries",
      config: configText,
      params_config: PARAMS_CONFIG,
      legend_config: getLegendConfigText(data.data, data.colors),
      interaction_config: {},
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.valueType,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

const getResourcesData = (data: Data) => {
  const { category, ...restSettings } = data.settings;
  const datasetValues = getTransformedData(data.data, "boolean");

  const fillColor = createFillColorInterpolation(data.colors);
  const configText = {
    styles: [
      {
        id: data.settings.name,
        type: "fill",
        paint: {
          "fill-color": fillColor,
          "fill-opacity": "@@#params.opacity",
        },
        layout: {
          visibility: {
            v: "@@#params.visibility",
            "@@function": "setVisibility",
          },
        },
      },
    ],
  };

  const layers = [
    {
      name: data.settings.name,
      type: "countries",
      config: configText,
      params_config: PARAMS_CONFIG,
      legend_config: getLegendConfigResources(data.colors),
      interaction_config: {},
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.valueType,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

const getBooleanData = (data: Data) => {
  const { category, ...restSettings } = data.settings;
  const datasetValues = getTransformedData(data.data, "boolean");

  const fillColor = transformToMatchExpression(data.colors);
  const configText = {
    styles: [
      {
        id: data.settings.name,
        type: "fill",
        paint: {
          "fill-color": fillColor,
          "fill-opacity": "@@#params.opacity",
        },
        layout: {
          visibility: {
            v: "@@#params.visibility",
            "@@function": "setVisibility",
          },
        },
      },
    ],
  };

  const layers = [
    {
      name: data.settings.name,
      type: "countries",
      config: configText,
      params_config: PARAMS_CONFIG,
      legend_config: getLegendConfigBoolean(data.colors),
      interaction_config: {},
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.valueType,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

const getDataParsed = (type: DatasetValueType | undefined, data: Data) => {
  switch (type) {
    case "resource":
      return getResourcesData(data);
    case "text":
      return getTextData(data);
    case "boolean":
      return getBooleanData(data);
    default:
      return getNumberData(data);
  }
};

const getTransformedData = (data: Data["data"], key: string) => {
  return Object.keys(data).map((country) => {
    return {
      country,
      [key]: data[country] || null,
    };
  });
};

const transformToMatchExpression = (data: { [key: string]: string }) => {
  const matchExpression = Object.entries(data).reduce(
    (acc, [key, value]) => {
      acc.push(key, value);
      return acc;
    },
    ["match", ["get", "value"]],
  );
  matchExpression.push(DEFAULT_COLOR);

  return matchExpression;
};

const createFillColorExpression = (data: Data, minValue: number, maxValue: number) => {
  const minColor = data.colors.min;
  const maxColor = data.colors.max;
  return [
    "case",
    ["all", ["has", "value"], ["==", ["typeof", ["get", "value"]], "number"]],
    ["interpolate", ["linear"], ["get", "value"], minValue, minColor, maxValue, maxColor],
    DEFAULT_COLOR,
  ];
};

const createFillColorInterpolation = (data: Data["colors"]) => {
  const minColor = data.min;
  const maxColor = data.max;

  return [
    "interpolate",
    ["linear"],
    ["get", "value"],
    "@@#params.minValue",
    minColor,
    "@@#params.maxValue",
    maxColor,
  ];
};

export default function NewDatasetForm() {
  const { data: session } = useSession();

  const { push } = useRouter();

  const [step, setStep] = useAtom(datasetStepAtom);
  const [formValues, setFormValues] = useAtom(datasetValuesAtom);

  const { data: meData } = useGetUsersId(`${session?.user?.id}`, {
    populate: "role",
  });
  const ME_DATA = meData as UsersPermissionsUser & { role: UsersPermissionsRole };

  // contributor role can just suggest changes
  const { mutate: mutateDatasetEditSuggestion } = usePostDatasetEditSuggestions({
    mutation: {
      onSuccess: (data) => {
        console.info("Success creating dataset:", data);
        push(`/dashboard`);
      },
      onError: (error: Error) => {
        console.error("Error creating dataset:", error);
      },
    },
    request: {},
  });

  const handleSettingsSubmit = useCallback(
    (values: Data["settings"]) => {
      setFormValues({ ...formValues, settings: values });
      setStep(2);
    },
    [formValues, setFormValues, setStep],
  );

  const handleDataSubmit = useCallback(
    (values: Data["data"]) => {
      setFormValues({ ...formValues, data: values });
      setStep(3);
    },
    [formValues, setFormValues, setStep],
  );

  const handleColorsSubmit = useCallback(
    (values: Data["colors"]) => {
      const data = { ...formValues, colors: values };
      setFormValues(data);

      if (ME_DATA?.role?.type === "authenticated") {
        mutateDatasetEditSuggestion({
          data: {
            data: {
              ...data.settings,
              value_type: data.settings.valueType,
              data: data.data,
              colors: data.colors,
              review_status: "pending",
            },
          },
        });
      }

      // BULK UPLOAD REQUIRED
      if (ME_DATA?.role?.type === "admin") {
        const { valueType } = data.settings;
        const parsedData = getDataParsed(valueType, data);
        updateOrCreateDataset(parsedData, session?.apiToken as string);
      }
    },
    [formValues, setFormValues, ME_DATA, mutateDatasetEditSuggestion, session?.apiToken],
  );

  return (
    <>
      {step === 1 && (
        <DatasetSettingsForm
          id="dataset-settings"
          title="New dataset"
          data={formValues}
          onSubmit={handleSettingsSubmit}
        />
      )}
      {step === 2 && (
        <DatasetDataForm
          id="dataset-data"
          title="New dataset"
          data={formValues}
          onSubmit={handleDataSubmit}
        />
      )}
      {step === 3 && (
        <DatasetColorsForm
          id="dataset-colors"
          title="New dataset"
          data={formValues}
          onSubmit={handleColorsSubmit}
        />
      )}
    </>
  );
}
