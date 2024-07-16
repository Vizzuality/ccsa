import { CategoryResponse, Dataset } from "@/types/generated/strapi.schemas";

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
    value_type?: Dataset["value_type"];
    category?: number | CategoryResponse;
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
  value_type: "number";
  label: string;
  value: "country_id" | "number";
}

interface TextDataColumn {
  value_type: "text";
  label: string;
  value: "country_id" | "text";
}

interface BooleanDataColumn {
  value_type: "boolean";
  label: string;
  value: "country_id" | "boolean";
}

interface ResourceDataColumn {
  value_type: "resource";
  label: string;
  value: "country_id" | "resource";
}

export type DATA_COLUMN =
  | NumberDataColumn
  | TextDataColumn
  | BooleanDataColumn
  | ResourceDataColumn;
