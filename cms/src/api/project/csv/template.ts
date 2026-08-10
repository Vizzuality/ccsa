/**
 * Builds the downloadable project import template and the machine-readable guide
 * behind it.
 *
 * Both are generated from the same column contract the parser validates against,
 * and definitions and accepted values are read live from the CMS - so adding a
 * sector or editing a field's help text in Strapi is reflected in the next
 * download with no client release.
 */

import * as stringify from "csv-stringify/sync";

import {
  COMMENT_PREFIX,
  CsvColumn,
  MULTI_VALUE_SEPARATOR,
  PROJECT_CSV_COLUMNS,
} from "./columns";

/** Above this, the accepted-value list is summarised instead of enumerated. */
const MAX_LISTED_VALUES = 40;

export interface ProjectCsvColumnGuide {
  name: string;
  required: boolean;
  multiValue: boolean;
  description: string;
  example: string;
  /** `null` when there is no fixed list, or the list is too long to show. */
  acceptedValues: string[] | null;
  /** Number of accepted values, even when they are not enumerated. */
  acceptedValuesCount: number | null;
}

/** Collapses the CMS richtext help text into something that fits on one comment line. */
function flattenHelpText(raw?: string): string {
  if (!raw) {
    return "";
  }

  return raw
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHelpText(): Promise<Record<string, string>> {
  try {
    const metadata: any = await strapi.entityService.findMany(
      "api::project-field-metadata.project-field-metadata"
    );

    return metadata ?? {};
  } catch (error) {
    strapi.log.warn(
      `Could not read project field metadata for the CSV template: ${error.message}`
    );
    return {};
  }
}

async function fetchAcceptedValues(column: CsvColumn): Promise<string[]> {
  const { uid, field } = column.lookup;

  const rows: any = await strapi.entityService.findMany(uid as any, {
    fields: [field],
    sort: { [field]: "asc" },
    limit: 1000,
  });

  return (rows ?? [])
    .map((row: any) => String(row?.[field] ?? "").trim())
    .filter(Boolean);
}

export async function buildProjectImportGuide(): Promise<
  ProjectCsvColumnGuide[]
> {
  const helpText = await fetchHelpText();

  return Promise.all(
    PROJECT_CSV_COLUMNS.map(async (column) => {
      const values = column.lookup ? await fetchAcceptedValues(column) : null;

      return {
        name: column.name,
        required: column.required,
        multiValue: column.multiValue,
        description:
          flattenHelpText(
            column.metadataField ? helpText[column.metadataField] : undefined
          ) || column.description,
        example: column.example,
        acceptedValues:
          values && values.length <= MAX_LISTED_VALUES ? values : null,
        acceptedValuesCount: values ? values.length : null,
      };
    })
  );
}

function comment(line = ""): string {
  return line ? `${COMMENT_PREFIX} ${line}` : COMMENT_PREFIX;
}

export function renderProjectImportTemplate(
  guide: ProjectCsvColumnGuide[]
): string {
  const nameWidth = Math.max(...guide.map((column) => column.name.length));

  const lines: string[] = [
    comment("CCSA project import template"),
    comment(),
    comment("Fill in one row per project underneath the column headings."),
    comment(
      `Lines starting with "${COMMENT_PREFIX}" are guidance only. They are ignored on import, so you can leave them in place.`
    ),
    comment(
      "REQUIRED columns must have a value in every row. Columns marked optional may be left blank."
    ),
    comment(
      `Columns that accept more than one value separate them with "${MULTI_VALUE_SEPARATOR}" - for example Jamaica${MULTI_VALUE_SEPARATOR}Belize`
    ),
    comment("Do not add, remove or rename columns."),
    comment(),
    comment("COLUMNS"),
  ];

  for (const column of guide) {
    const multiValueNote = column.multiValue
      ? ` Separate several with "${MULTI_VALUE_SEPARATOR}".`
      : "";

    lines.push(
      comment(
        `${column.name.padEnd(nameWidth)}  ${
          column.required ? "REQUIRED" : "optional"
        }  ${column.description}${multiValueNote} Example: ${column.example}`
      )
    );
  }

  const withFixedValues = guide.filter(
    (column) => column.acceptedValuesCount !== null
  );

  if (withFixedValues.length > 0) {
    lines.push(
      comment(),
      comment("ACCEPTED VALUES"),
      comment(
        "Values must match exactly, including capitalisation and punctuation."
      )
    );

    for (const column of withFixedValues) {
      if (column.acceptedValuesCount === 0) {
        lines.push(
          comment(
            `${column.name}: none configured yet - contact an administrator`
          )
        );
      } else if (column.acceptedValues) {
        lines.push(
          comment(`${column.name}: ${column.acceptedValues.join("; ")}`)
        );
      } else {
        lines.push(
          comment(
            `${column.name}: ${column.acceptedValuesCount} accepted values - use the exact name shown in the project form's dropdown`
          )
        );
      }
    }
  }

  const columnNames = guide.map((column) => column.name);

  const csv = stringify.stringify([columnNames.map(() => "")], {
    header: true,
    columns: columnNames,
  });

  return `${lines.join("\n")}\n${csv}`;
}
