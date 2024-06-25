import { Dataset } from "@/types/generated/strapi.schemas";

export type VALUE_TYPE = Dataset["value_type"];

export interface Data {
  settings: {
    name: string;
    description: string;
    valueType?: Dataset["value_type"];
    category?: number;
    unit?: string;
  };
  data: { [key: string]: string | number | boolean | undefined };
  colors: Record<string, string>;
}

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

export type FormSchemaType = Record<string, string | number | boolean | undefined>;
