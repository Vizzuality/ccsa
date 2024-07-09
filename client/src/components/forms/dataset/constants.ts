import type { DATA_COLUMN, VALUE_TYPE } from "./types";

// Form DATA (step 2)
export const DATA_COLUMNS_TYPE: Record<VALUE_TYPE, DATA_COLUMN[]> = {
  number: [
    {
      valueType: "number",
      label: "Country id",
      value: "country_id",
    },
    {
      valueType: "number",
      label: "Number",
      value: "number",
    },
  ],
  text: [
    {
      valueType: "text",
      label: "Country id",
      value: "country_id",
    },
    {
      valueType: "text",
      label: "Text",
      value: "text",
    },
  ],
  boolean: [
    {
      valueType: "boolean",
      label: "Country id",
      value: "country_id",
    },
    {
      valueType: "boolean",
      label: "Boolean",
      value: "boolean",
    },
  ],
  resource: [
    {
      valueType: "resource",
      label: "Country id",
      value: "country_id",
    },
    {
      valueType: "resource",
      label: "Resource",
      value: "resource",
    },
  ],
};

// FORM COLORS (step 3)

export const COLORS_FIELDS_NUMBER = [
  {
    valueType: "number",
    label: "Min value",
    value: "min_value",
  },
  {
    valueType: "number",
    label: "Max value",
    value: "max_value",
  },
];

export const COLORS_FIELDS_TEXT = [
  {
    valueType: "text",
    label: "Country id",
    value: "country_id",
  },
  {
    valueType: "text",
    label: "Text",
    value: "text",
  },
];

export const COLORS_FIELDS_BOOLEAN = [
  {
    valueType: "boolean",
    label: "TRUE value",
    value: "true_value",
  },
  {
    valueType: "boolean",
    label: "FALSE value",
    value: "false_value",
  },
];

export const COLORS_FIELDS_RESOURCE = [
  {
    valueType: "resource",
    label: "Country id",
    value: "country_id",
  },
  {
    valueType: "resource",
    label: "Title",
    value: "title",
  },
  {
    valueType: "resource",
    label: "Description",
    value: "description",
  },
  {
    valueType: "resource",
    label: "Link",
    value: "link",
  },
];
