import { Dataset } from "@/types/generated/strapi.schemas";

export type VALUE_TYPE = Dataset["value_type"];

export interface DatasetValuesCSV {
  country_id: string;
  number?: number;
  boolean?: boolean;
  text?: string;
  link_title?: string;
  link_url?: string;
  description?: string;
}

export interface Data {
  settings: {
    name: string;
    description: string;
    valueType?: Dataset["value_type"];
    category?: number;
    unit?: string;
    updatedAt?: string;
  };
  data: {
    [key: string]: string | number | boolean | undefined | Resource[];
  };
  colors: Record<string, string>;
}

export interface Resource {
  link_title: string;
  description: string;
  link_url: string;
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
  value: "country_id" | "resource";
}

export type DATA_COLUMN =
  | NumberDataColumn
  | TextDataColumn
  | BooleanDataColumn
  | ResourceDataColumn;
