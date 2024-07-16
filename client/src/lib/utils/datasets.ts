import type { DatasetValueType } from "@/types/generated/strapi.schemas";

import { dataValueType } from "@/constants/datasets";

import { Data } from "@/components/forms/dataset/types";

type Colors = { [key: string]: string };

type DataValueType = (typeof dataValueType)[number];

export const PARAMS_CONFIG = [
  {
    key: "opacity",
    default: 1,
  },
  {
    key: "visibility",
    default: true,
  },
];

export const DEFAULT_COLOR = "#999999";

export const isDatasetValueProperty = (v?: string): v is DataValueType => {
  return !!v && dataValueType.includes(v as DataValueType);
};

// Dataset Config (data values, layers)
export const getLegendConfigNumber = (colors: Colors, minValue: number, maxValue: number) => {
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

export const getLegendConfigBoolean = (colors: Colors) => {
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

export const getLegendConfigText = (data: Data["data"], colors: Colors) => {
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
      colors: data.colors,
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.value_type,
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
      colors: data.colors,
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.value_type,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

const getResourcesData = (data: Data) => {
  const { category, ...restSettings } = data.settings;
  const datasetValues = getTransformedData(data.data, "resources");

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
      colors: data.colors,
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.value_type,
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
      colors: data.colors,
    },
  ];

  return {
    ...restSettings,
    value_type: data.settings.value_type,
    category_ids: [category],
    dataset_values: datasetValues,
    layers,
  };
};

export const getDataParsed = (type: DatasetValueType | undefined, data: Data) => {
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
      ...(key !== "resources" && ({ [`value_${key}`]: data[country] } || null)),
      ...((key === "resources" && { [key]: data[country] }) || {
        resources: {
          link_title: null,
          description: null,
          link_url: null,
        },
      }),
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
