import { CSVImportTypes } from "@/components/new-dataset/step-description/types";
import { Resource } from "@/types/generated/strapi.schemas";

interface DataObject {
  [key: string]: number | string | boolean | Resource[] | undefined;
}

// Define the type for CSV type mapping
const csvTypeMapping: Record<string, string[]> = {
  number: ["country_id", "number"],
  text: ["country_id", "text"],
  boolean: ["country_id", "boolean"],
  resource: ["country_id", "link_title", "link_url", "description"],
  project: [
    "name",
    "info",
    "pillar",
    "amount",
    "countries",
    "sdgs",
    "status",
    "funding",
    "organization_type",
    "source_country",
    "objective",
    "highlight",
  ],
  "other-tools": ["name", "description", "link", "category"],
  collaborators: ["name", "type", "link"],
};

// Function to generate CSV content from data
function generateCSVContent(data: DataObject, type: CSVImportTypes): string {
  // Get the columns from the csvTypeMapping
  const columns = csvTypeMapping[type];

  if (!columns) {
    throw new Error(`Unsupported type: ${type}`);
  }

  // Create the CSV header row
  const headerRow = columns.join(",") + "\n";

  if (Object.keys(data).length === 0) {
    // If no data, return header and a default row with empty values
    const emptyRow = columns.map(() => "").join(",");
    return headerRow + emptyRow;
  }

  // Create the CSV rows from the data
  const rows = Object.keys(data)
    .map((country) => {
      const row: { [key: string]: string } = { country_id: country };
      columns.forEach((col) => {
        if (col !== "country_id") {
          row[col] = "";
        }
      });
      return columns.map((col) => row[col] ?? "").join(",");
    })
    .join("\n");

  // Combine the header and rows into a single CSV string
  return headerRow + rows;
}

// Function to download a CSV file
export function downloadCSV(
  data: DataObject,
  type: CSVImportTypes,
  filename: string = "data.csv",
): void {
  // Generate CSV content
  const csvContent = generateCSVContent(data, type);

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element
  const link = document.createElement("a");

  // Create a URL for the Blob and set it as the href attribute
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);

  // Append the link to the document body and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link and revoking the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
