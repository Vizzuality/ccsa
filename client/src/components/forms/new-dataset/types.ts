export type VALUE_TYPE = "number" | "text" | "boolean" | "resource";

interface NumberDataColumn {
  valueType: "number";
  label: string;
  value: "country_id" | "number";
}

interface TextDataColumn {
  valueType: "text";
  label: string;
  value: "country_id" | "text";
}

interface BooleanDataColumn {
  valueType: "boolean";
  label: string;
  value: "country_id" | "boolean";
}

interface ResourceDataColumn {
  valueType: "resource";
  label: string;
  value: "country_id" | "title" | "description" | "link";
}

export type DATA_COLUMN =
  | NumberDataColumn
  | TextDataColumn
  | BooleanDataColumn
  | ResourceDataColumn;

export type FormSchemaType = Record<string, string | number | undefined>;
