import { CSVImportTypes } from "./types";

import {
  PROJECTS_CSV_CONTENT,
  OTHER_TOOLS_CSV_CONTENT,
  COLLABORATORS_CSV_CONTENT,
  LINK_CSV_CONTENT,
} from "./constants";

export default function CSVInfoContent({ valueType }: { valueType: CSVImportTypes }) {
  return (
    <div className="space-y-5 p-5">
      <h3 className="font-bold">CSV Import Information</h3>
      <p>This feature allows you to import a CSV file with the following format:</p>

      {valueType === "text" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Text</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span> <code>country_id, text</code>.
            </p>
            <p>
              Where <code>country_id</code> refers to the ISO3 country code and <code>text</code>{" "}
              refers to a textual value.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>country_id, text</code>
              <code>AIA, Medium</code>
            </div>
          </div>
        </div>
      )}

      {valueType === "boolean" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Boolean</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span> <code>country_id, boolean</code>.
            </p>
            <p>
              Where <code>country_id</code> refers to the ISO3 country code and <code>boolean</code>{" "}
              refers to a boolean value (<code>true</code> or <code>false</code>).
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>country_id, boolean</code>
              <code>MEX, true</code>
            </div>
          </div>
        </div>
      )}

      {valueType === "number" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Number</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span> <code>country_id, number</code>.
            </p>
            <p>
              Where <code>country_id</code> refers to the ISO3 country code and <code>number</code>{" "}
              refers to a numeric value.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>country_id, number</code>
              <code>VIR, 123</code>
            </div>
          </div>
        </div>
      )}

      {valueType === "resource" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">{LINK_CSV_CONTENT.title}</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>{LINK_CSV_CONTENT.columns.join(", ")}</code>.
            </p>
            <p>
              Where <code>country_id</code> refers to the ISO3 country code, <code>link_title</code>{" "}
              is the title of the link, <code>link_url</code> is the URL, and{" "}
              <code>description</code> provides additional details about the link. There can be more
              than one resource for each country, so <code>link_title</code>, <code>link_url</code>,
              and <code>description</code> can be arrays.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>{LINK_CSV_CONTENT.columns.join(", ")}</code>
              <code>{LINK_CSV_CONTENT.examples[0]}</code>
            </div>
            <p>
              If there are multiple resources for a single country, the CSV should look like this:
            </p>
            <div className="flex flex-col bg-gray-100 p-4">
              {LINK_CSV_CONTENT.columns.join(", ")}
              {LINK_CSV_CONTENT.examples.map((example) => (
                <code key={example}>{example}</code>
              ))}
            </div>
          </div>
        </div>
      )}

      {valueType === "project" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">{PROJECTS_CSV_CONTENT.title}</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>{PROJECTS_CSV_CONTENT.columns.join(", ")}</code>.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col space-y-2 bg-gray-100 p-4">
              <code>{PROJECTS_CSV_CONTENT.columns.join(", ")}</code>
              {PROJECTS_CSV_CONTENT.examples.map((example) => (
                <code key={example}>{example}</code>
              ))}
            </div>
          </div>
        </div>
      )}

      {valueType === "other-tools" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">{OTHER_TOOLS_CSV_CONTENT.title}</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>{OTHER_TOOLS_CSV_CONTENT.columns.join(", ")}</code>.
            </p>
            <p className="font-semibold">Categories:</p>
            <ul className="ml-5 list-disc">
              {OTHER_TOOLS_CSV_CONTENT.categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>{OTHER_TOOLS_CSV_CONTENT.columns.join(", ")}</code>
              {OTHER_TOOLS_CSV_CONTENT.examples.map((example) => (
                <code key={example}>{example}</code>
              ))}
            </div>
          </div>
        </div>
      )}

      {valueType === "collaborators" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">{COLLABORATORS_CSV_CONTENT.title}</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>{COLLABORATORS_CSV_CONTENT.columns.join(", ")}</code>.
            </p>
            <p>
              <span className="font-semibold">Type:</span> The type field should be either{" "}
              <code>Donor</code> or <code>Collaborator</code>.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>{COLLABORATORS_CSV_CONTENT.columns.join(", ")}</code>
              {COLLABORATORS_CSV_CONTENT.examples.map((example) => (
                <code key={example}>{example}</code>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="note">
        If you are not sure how to proceed, you can download a template on this page with all
        available countries to fill in the values.
      </p>
    </div>
  );
}
