/**
 * project service
 */

import { factories } from "@strapi/strapi";
import * as fs from "fs";
import * as csv from "csv-parse/sync";
import * as stringify from "csv-stringify/sync";

import {
  ALLOWED_CSV_COLUMNS,
  COMMENT_PREFIX,
  CsvColumn,
  MULTI_VALUE_SEPARATOR,
  PROJECT_CSV_COLUMNS,
  REQUIRED_CSV_COLUMNS,
} from "../csv/columns";

type CsvRow = Record<string, string>;

/**
 * Removes the `#` guidance block that ships with the downloadable template.
 * Only full lines are treated as comments, so a `#` inside a project name or
 * description survives.
 */
function stripGuidanceLines(content: string): string {
  return content
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith(COMMENT_PREFIX))
    .join("\n");
}

async function findIdByLookup(
  column: CsvColumn,
  value: string
): Promise<number> {
  const { uid, field, label } = column.lookup;

  const result: any = await strapi.entityService.findMany(uid as any, {
    filters: { [field]: value },
    fields: ["id"],
  });

  if (result.length === 0) {
    throw new Error(`No ${label} found with the name "${value}"`);
  }

  return result[0].id;
}

/**
 * Turns one CSV cell into the value the import plugin expects: an array of ids
 * for relations, the trimmed string otherwise.
 */
async function resolveValue(
  column: CsvColumn,
  raw: string
): Promise<string | number[]> {
  const value = String(raw ?? "").trim();

  if (!column.lookup) {
    return value;
  }

  if (!column.multiValue) {
    return [await findIdByLookup(column, value)];
  }

  const names = value
    .split(MULTI_VALUE_SEPARATOR)
    .map((name) => name.trim())
    .filter(Boolean);

  return Promise.all(names.map((name) => findIdByLookup(column, name)));
}

export default factories.createCoreService("api::project.project", {
  async parseAndReplaceIds(file, author = null) {
    const fileContent = stripGuidanceLines(
      fs.readFileSync(file.path, "utf8")
    );

    const records: CsvRow[] = csv
      .parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        // Excel writes a BOM, which would otherwise corrupt the first column name.
        bom: true,
        // Tolerates the `", "` spacing people copy out of the documentation.
        trim: true,
      })
      .filter((row: CsvRow) =>
        Object.values(row).some((v) => String(v ?? "").trim() !== "")
      );

    if (records.length === 0) {
      throw new Error("CSV file is empty");
    }

    const csvColumns = Object.keys(records[0]);

    const invalidColumns = csvColumns.filter(
      (col) => !ALLOWED_CSV_COLUMNS.includes(col)
    );
    if (invalidColumns.length > 0) {
      throw new Error(`Invalid columns detected: ${invalidColumns.join(", ")}`);
    }

    const missingColumns = REQUIRED_CSV_COLUMNS.filter(
      (col) => !csvColumns.includes(col)
    );
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
    }

    // Optional columns may be absent entirely, so older files still import.
    const presentColumns = PROJECT_CSV_COLUMNS.filter((column) =>
      csvColumns.includes(column.name)
    );

    const updatedRecords = await Promise.all(
      records.map(async (row: CsvRow, index: number) => {
        const updatedRow: Record<string, any> = {};

        for (const column of presentColumns) {
          const raw = String(row[column.name] ?? "").trim();

          if (!raw) {
            if (column.required) {
              throw new Error(
                `Row ${index + 1}: missing value for required column "${
                  column.name
                }"`
              );
            }
            updatedRow[column.target] = "";
            continue;
          }

          updatedRow[column.target] = await resolveValue(column, raw);
        }

        updatedRow.publishedAt = new Date().toISOString();

        if (author) {
          updatedRow.author = [author];
        }

        return updatedRow;
      })
    );

    const updatedCSV = stringify.stringify(updatedRecords, { header: true });

    return {
      csvData: updatedCSV,
      rowCount: updatedRecords.length,
    };
  },
});
