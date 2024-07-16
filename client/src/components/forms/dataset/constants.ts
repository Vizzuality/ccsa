import type { DATA_COLUMN, VALUE_TYPE } from "./types";

// Form DATA (step 2)
export const DATA_COLUMNS_TYPE: Record<VALUE_TYPE, DATA_COLUMN[]> = {
  number: [
    {
      value_type: "number",
      label: "Country id",
      value: "country_id",
    },
    {
      value_type: "number",
      label: "Number",
      value: "number",
    },
  ],
  text: [
    {
      value_type: "text",
      label: "Country id",
      value: "country_id",
    },
    {
      value_type: "text",
      label: "Text",
      value: "text",
    },
  ],
  boolean: [
    {
      value_type: "boolean",
      label: "Country id",
      value: "country_id",
    },
    {
      value_type: "boolean",
      label: "Boolean",
      value: "boolean",
    },
  ],
  resource: [
    {
      value_type: "resource",
      label: "Country id",
      value: "country_id",
    },
    {
      value_type: "resource",
      label: "Resource",
      value: "resource",
    },
  ],
};

// FORM COLORS (step 3)

export const COLORS_FIELDS_NUMBER = [
  {
    value_type: "number",
    label: "Min value",
    value: "min_value",
  },
  {
    value_type: "number",
    label: "Max value",
    value: "max_value",
  },
];

export const COLORS_FIELDS_TEXT = [
  {
    value_type: "text",
    label: "Country id",
    value: "country_id",
  },
  {
    value_type: "text",
    label: "Text",
    value: "text",
  },
];

export const COLORS_FIELDS_BOOLEAN = [
  {
    value_type: "boolean",
    label: "TRUE value",
    value: "true_value",
  },
  {
    value_type: "boolean",
    label: "FALSE value",
    value: "false_value",
  },
];

export const COLORS_FIELDS_RESOURCE = [
  {
    value_type: "resource",
    label: "Country id",
    value: "country_id",
  },
  {
    value_type: "resource",
    label: "Title",
    value: "link_title",
  },
  {
    value_type: "resource",
    label: "Description",
    value: "description",
  },
  {
    value_type: "resource",
    label: "Link",
    value: "link_url",
  },
];
