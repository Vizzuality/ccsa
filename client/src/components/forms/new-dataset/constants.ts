import type { DATA_COLUMN, VALUE_TYPE } from "./types";

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
  ],
};
