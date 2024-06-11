type VALUE_TYPE = "number" | "text" | "boolean" | "resource";

export interface DATA_COLUMN {
  label: string;
  value: string;
}

export const DATA_COLUMNS_TYPE: Record<VALUE_TYPE, DATA_COLUMN[]> = {
  number: [
    {
      label: "Country id",
      value: "country_id",
    },
    {
      label: "Number",
      value: "number",
    },
  ],
  text: [
    {
      label: "Country id",
      value: "country_id",
    },
    {
      label: "Text",
      value: "text",
    },
  ],
  boolean: [
    {
      label: "Country id",
      value: "country_id",
    },
    {
      label: "Boolean",
      value: "boolean",
    },
  ],
  resource: [
    {
      label: "Country id",
      value: "country_id",
    },
    {
      label: "Title",
      value: "title",
    },
    {
      label: "Description",
      value: "description",
    },
    {
      label: "Link",
      value: "link",
    },
  ],
};
