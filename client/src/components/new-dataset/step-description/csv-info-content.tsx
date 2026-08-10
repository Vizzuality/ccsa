import { ProjectCsvColumnGuide } from "@/services/projects";

import { CSVImportTypes } from "./types";

import {
  PROJECTS_CSV_CONTENT,
  OTHER_TOOLS_CSV_CONTENT,
  COLLABORATORS_CSV_CONTENT,
  LINK_CSV_CONTENT,
} from "./constants";

export default function CSVInfoContent({
  valueType,
  projectsCsvGuide,
}: {
  valueType: CSVImportTypes;
  projectsCsvGuide?: ProjectCsvColumnGuide[];
}) {
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
              Download the template below. It lists every column with its definition, whether it is
              required, and the values it accepts. Guidance lines start with <code>#</code> and are
              ignored on import, so you can leave them in place.
            </p>
            {!projectsCsvGuide && <p>Loading the field list…</p>}
            {projectsCsvGuide && (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 pr-2 font-semibold">Column</th>
                      <th className="py-1 pr-2 font-semibold">Required</th>
                      <th className="py-1 pr-2 font-semibold">Description</th>
                      <th className="py-1 font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsCsvGuide.map((column) => (
                      <tr key={column.name} className="border-b align-top">
                        <td className="py-1 pr-2">
                          <code>{column.name}</code>
                        </td>
                        <td className="py-1 pr-2">{column.required ? "Yes" : "No"}</td>
                        <td className="py-1 pr-2">
                          {column.description}
                          {column.multiValue && (
                            <>
                              {" "}
                              Separate several with <code>;</code>.
                            </>
                          )}
                          {column.acceptedValues && (
                            <>
                              {" "}
                              Accepted values: {column.acceptedValues.join("; ")}.
                            </>
                          )}
                          {!column.acceptedValues && !!column.acceptedValuesCount && (
                            <>
                              {" "}
                              Must match one of the {column.acceptedValuesCount} options in the
                              project form&apos;s dropdown.
                            </>
                          )}
                        </td>
                        <td className="py-1">{column.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p>
              <span className="font-semibold">Note:</span> values that must match a dropdown option
              are case-sensitive and have to match exactly.
            </p>
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
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>{OTHER_TOOLS_CSV_CONTENT.columns.join(", ")}</code>
              {OTHER_TOOLS_CSV_CONTENT.examples.map((example) => (
                <code key={example}>{example}</code>
              ))}
            </div>
            <p>
              <span className="font-semibold">Note:</span> <code>other_tools_category</code> must
              match an existing option from the Category dropdown in the tool form below. Values
              are case-sensitive and must match exactly. To assign multiple categories, separate
              them with <code>;</code>.
            </p>
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
