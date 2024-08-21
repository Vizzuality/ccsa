import type {
  CategoryResponse,
  Dataset,
  Resource,
  DatasetEditSuggestion,
  ToolEditSuggestion,
  ProjectEditSuggestion,
  CollaboratorEditSuggestion,
} from "@/types/generated/strapi.schemas";

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
    review_status?: "approved" | "pending" | "declined";
    review_decision_details?: string;
  };
  data: {
    [key: string]: string | number | boolean | undefined | Resource[];
  };
  colors: Record<string, string>;
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

export type Label = "Datasets" | "Tool" | "Collaborator" | "Project";
export type Route = "datasets/changes-to-approve" | "other-tools" | "collaborators" | "projects";

export interface extendedDataset extends DatasetEditSuggestion {
  id?: number;
  label: Label;
  route: Route;
}

export interface extendedCollaboratorData extends CollaboratorEditSuggestion {
  id?: number;
  label: Label;
  route: Route;
}

export interface extendedProjectData extends ProjectEditSuggestion {
  id?: number;
  label: Label;
  route: Route;
}

export interface extendedToolData extends ToolEditSuggestion {
  id?: number;
  label: Label;
  route: Route;
}

export type DataTypes = (
  | extendedDataset
  | extendedToolData
  | extendedCollaboratorData
  | extendedProjectData
)[];
