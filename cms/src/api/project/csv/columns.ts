/**
 * Single source of truth for the project CSV contract.
 *
 * Consumed by:
 *  - services/project.ts        -> validates and parses uploaded files
 *  - controllers/project.ts     -> builds the downloadable template
 *
 * Keep this list in the order the template should present the columns; both the
 * template header and the parser's error messages follow it.
 */

export interface CsvColumnLookup {
  /** Content type the value is resolved against. */
  uid: string;
  /** Attribute the value is matched on. */
  field: string;
  /** Used in "No <label> found with the name ..." errors. */
  label: string;
}

export interface CsvColumn {
  /** Column name as it appears in the CSV. */
  name: string;
  /** Attribute the value is written to. Differs from `name` for `sector` -> `pillar`. */
  target: string;
  required: boolean;
  /** Accepts several `;`-separated values. */
  multiValue: boolean;
  /** Fallback definition, used when the CMS has no help text for the field. */
  description: string;
  example: string;
  /** Attribute on the `project-field-metadata` single type holding admin-authored help text. */
  metadataField?: string;
  lookup?: CsvColumnLookup;
}

export const PROJECT_CSV_COLUMNS: CsvColumn[] = [
  {
    name: "name",
    target: "name",
    required: true,
    multiValue: false,
    description: "Project title.",
    example: "Solar Microgrid Pilot",
    metadataField: "name",
  },
  {
    name: "highlight",
    target: "highlight",
    required: true,
    multiValue: false,
    description: "Short description of the project, shown on the project card.",
    example: "Clean energy access for off-grid villages",
    metadataField: "highlight",
  },
  {
    name: "status",
    target: "status",
    required: true,
    multiValue: false,
    description: "Current maturity of the project.",
    example: "Scaling/Expanding",
    metadataField: "status",
    lookup: {
      uid: "api::project-status.project-status",
      field: "name",
      label: "project status",
    },
  },
  {
    name: "objective",
    target: "objective",
    required: true,
    multiValue: false,
    description: "What the project is seeking from the platform.",
    example: "Attracting Investment and Securing Funding",
    metadataField: "objective",
    lookup: {
      uid: "api::objective.objective",
      field: "type",
      label: "objective",
    },
  },
  {
    name: "amount",
    target: "amount",
    required: true,
    multiValue: false,
    description: "Funding amount in USD. Digits only, no currency symbol or thousands separator.",
    example: "250000",
    metadataField: "amount",
  },
  {
    name: "countries",
    target: "countries",
    required: true,
    multiValue: true,
    description: "Caribbean countries the project operates in.",
    example: "Jamaica;Belize",
    metadataField: "countries",
    lookup: {
      uid: "api::country.country",
      field: "name",
      label: "country",
    },
  },
  {
    name: "source_country",
    target: "source_country",
    required: true,
    multiValue: false,
    description: "Country the implementing organization is based in.",
    example: "Barbados",
    metadataField: "source_country",
    lookup: {
      uid: "api::world-country.world-country",
      field: "name",
      label: "world country",
    },
  },
  {
    name: "sdgs",
    target: "sdgs",
    required: true,
    multiValue: true,
    description: "Sustainable Development Goals the project contributes to.",
    example: "SDG 7 - Affordable and clean energy;SDG 13 - Climate Action",
    metadataField: "sdgs",
    lookup: {
      uid: "api::sdg.sdg",
      field: "name",
      label: "SDG",
    },
  },
  {
    name: "sector",
    target: "pillar",
    required: true,
    multiValue: false,
    description: "Sector the project belongs to. Exactly one per project.",
    example: "90% Renewable Energy for All",
    metadataField: "pillar",
    lookup: {
      uid: "api::pillar.pillar",
      field: "name",
      label: "pillar",
    },
  },
  {
    name: "organization_type",
    target: "organization_type",
    required: true,
    multiValue: false,
    description: "Legal or organizational form of the implementing organization.",
    example: "For-profit",
    metadataField: "organization_type",
    lookup: {
      uid: "api::organization-type.organization-type",
      field: "name",
      label: "organization type",
    },
  },
  {
    name: "funding",
    target: "funding",
    required: true,
    multiValue: false,
    description: "Type of funding the project has received or is seeking.",
    example: "Grant",
    metadataField: "funding",
    lookup: {
      uid: "api::types-of-funding.types-of-funding",
      field: "name",
      label: "funding",
    },
  },
  {
    name: "info",
    target: "info",
    required: false,
    multiValue: false,
    description: "Longer narrative about the project.",
    example: "Pilot deploying solar microgrids in rural communities",
    metadataField: "info",
  },
  {
    name: "year_established",
    target: "year_established",
    required: false,
    multiValue: false,
    description: "Four-digit year the project started. 1900 or later, not in the future.",
    example: "2024",
    metadataField: "year_established",
  },
  {
    name: "other_funding",
    target: "other_funding",
    required: false,
    multiValue: false,
    description: 'Free-text funding type. Required when "funding" is "Other".',
    example: "Blended concessional finance",
    metadataField: "other_funding",
  },
  {
    name: "video_link",
    target: "video_link",
    required: false,
    multiValue: false,
    description: "URL of a video about the project.",
    example: "https://youtu.be/example",
    metadataField: "video_link",
  },
];

export const REQUIRED_CSV_COLUMNS = PROJECT_CSV_COLUMNS.filter(
  (column) => column.required
).map((column) => column.name);

export const ALLOWED_CSV_COLUMNS = PROJECT_CSV_COLUMNS.map(
  (column) => column.name
);

/** Separator for columns that accept several values. */
export const MULTI_VALUE_SEPARATOR = ";";

/** Guidance lines in the template start with this and are stripped before parsing. */
export const COMMENT_PREFIX = "#";
