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
  // Resource,
} from "@/types/generated/strapi.schemas";
import { useGetUsersId } from "@/types/generated/users-permissions-users-roles";

import { datasetStepAtom, datasetValuesAtom } from "@/app/store";

import DatasetColorsForm from "@/components/forms/dataset/colors";
import DatasetDataForm from "@/components/forms/dataset/data";
import DatasetSettingsForm from "@/components/forms/dataset/settings";
import { Data } from "@/components/forms/dataset/types";

// import { updateOrCreateDataset } from "@/hooks/index";

// const getLimitsTypeNumber = (data: number[]) => {
//   // Filter out objects with null values and extract the values
//   const values = data.filter((item) => item !== null && !isNaN(item));

//   // Find the min and max values
//   const min = Math.min(...values);
//   const max = Math.max(...values);

//   return { min, max };
// };

// const getLimits = ({
//   values,
//   valueType,
// }: {
//   values: unknown;
//   // (string | number | boolean | Resource[] | undefined)[];
//   valueType: DatasetValueType | undefined;
// }) => {
//   switch (valueType) {
//     case "resource":
//       return { min: -50, max: 50 };
//     case "text":
//       values;
//       return { min: 900, max: 1100 };
//     case "boolean":
//       return { min: 0, max: 100 };
//     default:
//       return getLimitsTypeNumber(values as number[]);
//   }
// };
type Colors = { [key: string]: string };
type Items = { [key: string]: any };
type LegendItem = {
  color: string;
  label: string | number;
  value: string | number;
};
type LegendConfig = {
  type: string;
  items: LegendItem[];
};

type LegendData = {
  colors: Colors;
  items: Items;
};

const getLegendConfigNumber = (data: Items, colors: Colors) => {
  const items = Object.values(data);
  const values = items.filter((item) => item !== null && !isNaN(item));
  // Find the min and max values
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    type: "gradient",
    items: [
      {
        color: colors.min,
        label: min,
        value: min,
      },
      {
        color: colors.max,
        label: max,
        value: max,
      },
    ],
  };
};

const getLegendConfigBoolean = (data: Items, colors: Colors) => {
  const items = Object.values(data);
  const values = items.filter((item) => item !== null && !isNaN(item));
  // Find the min and max values
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    type: "basic",
    items: [
      {
        color: colors.min,
        label: min,
        value: min,
      },
      {
        color: colors.max,
        label: max,
        value: max,
      },
    ],
  };
};

const getLegendConfigText = (items: Items, colors: Colors) => {
  const categories = [...new Set(Object.values(items))];

  return {
    type: "basic",
    items: categories
      .filter((category) => colors[category] !== undefined)
      .map((category) => ({
        color: colors[category],
        label: category,
        value: category,
      })),
  };
};

const legendConfig = (type: DatasetValueType | undefined, data: Data) => {
  const { colors, data: dataValue } = data;
  switch (type) {
    case "text":
      return getLegendConfigText(dataValue, colors);
    case "boolean":
      return getLegendConfigBoolean(dataValue, colors);
    case "number":
      return getLegendConfigNumber(dataValue, colors);
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

const typeToKey = (type: DatasetValueType | undefined) => {
  switch (type) {
    case "resource":
      return "resources";
    case "text":
      return "text";
    case "boolean":
      return "boolean";
    default:
      return "number";
  }
};

const getTransformedData = (data: Data["data"], type: DatasetValueType | undefined) => {
  const key = typeToKey(type);
  return Object.keys(data).map((country) => {
    return {
      country,
      [key]: data[country] || [],
    };
  });
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

  // UsersPermissionsRole

  // const { mutate: mutateDataset } = usePostDatasets({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset:", error);
  //     },
  //   },
  // });

  // const { mutate: mutateDatasetValues } = usePostDatasetValues({
  //   mutation: {
  //     onSuccess: (data) => {
  //       console.log("Success creating dataset values:", data);
  //     },
  //     onError: (error) => {
  //       console.error("Error creating dataset values:", error);
  //     },
  //   },
  // });

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
        console.info(data);
        // const { category, valueType, ...restSettings } = data.settings;
        // const datasetValues = getTransformedData(data.data, valueType);
        // const values = Object.values(data.data);
        // const layers = {
        //   name: data.settings.name,
        // };
        // const extremes = getLimits({ values, valueType });
        // const parsedData = {
        //   ...restSettings,
        //   category_ids: category,
        //   dataset_values: datasetValues,
        //   layers,
      }
      // if (ME_DATA?.role?.type === "admin") {
      console.info(data);
      const { category, valueType, ...restSettings } = data.settings;
      const datasetValues = getTransformedData(data.data, valueType);

      const layers = {
        name: data.settings.name,
        type: "countries",
        config: {},
        params_config: [
          {
            key: "opacity",
            default: 1,
          },
          {
            key: "visibility",
            default: true,
          },
        ],
        legend_config: legendConfig(valueType, data),
        interaction_config: {},
      };

      const parsedData = {
        ...restSettings,
        category_ids: category,
        dataset_values: datasetValues,
        layers,
      };

      // updateOrCreateDataset(parsedData);
      // }
    },
    [formValues, setFormValues, ME_DATA, mutateDatasetEditSuggestion],
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
