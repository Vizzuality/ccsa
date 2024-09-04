import { CSVImportTypes } from "./types";

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
          <h4 className="font-metropolis tracking-tight">Link</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>country_id, link_title, link_url, description</code>.
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
              <code>country_id, link_title, link_url, description</code>
              <code>AIA, Example, http://example.com, link description</code>
            </div>
            <p>
              If there are multiple resources for a single country, the CSV should look like this:
            </p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>country_id, link_title, link_url, description</code>

              <code>AIA, Title 1, http://example1.com, Description 1</code>

              <code>AIA, Title 2, http://example2.com, Description 2</code>

              <code>MEX, Title 3, http://example3.com, Description 3</code>

              <code>VIR, Title 4, http://example4.com, Description 4</code>
            </div>
          </div>
        </div>
      )}

      {valueType === "project" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Project/s</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>
                name, highlight, status, objective, amount, countries, source_country, sdgs, pillar,
                organization_type, info, funding
              </code>
              .
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>
                name, highlight, status, objective, amount, countries, source_country, sdgs, pillar,
                organization_type, info, funding
              </code>
              <code>
                Import test 1, Highlight 1, In Execution, This project has been delivered, 120000,
                Jamaica; Bahamas; Belize, The United States, SDG 12 - Responsible production and
                consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 1.5% New
                Green Jobs for Physical & Economic Resilience, For-profit, ,
              </code>
              <code>
                Import test 2, Highlight 2, Completed, This project has been delivered, 120001,
                Trinidad and Tobago; Belize, Trinidad & Tobago, SDG 7 - Affordable and clean energy;
                SDG 8 - Decent work and economic growth; SDG 9 - Industry Innovation and
                Infrastructure; SDG 11 - Sustainable Cities and Communities; SDG 12 - Responsible
                production and consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the
                goals, 90% Renewable Energy for All, For-profit, ,
              </code>
              <code>
                Import test 3, Highlight 3, Start-up to Early Stage, This project has been
                delivered, 120002, Belize; Bahamas, Belize, SDG 7 - Affordable and clean energy; SDG
                13 - Climate Action; SDG 17 - Partnership for the goals, 90% Renewable Energy for
                All, For-profit, ,
              </code>
              <code>
                Import test 4, Highlight 4, Start-up to Early Stage, This project has been
                delivered, 120003, Bahamas, Barbados, SDG 7 - Affordable and clean energy; SDG 8 -
                Decent work and economic growth; SDG 9 - Industry Innovation and Infrastructure; SDG
                11 - Sustainable Cities and Communities; SDG 12 - Responsible production and
                consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 90%
                Renewable Energy for All, For-profit, ,
              </code>
            </div>
            <p>
              If there are multiple resources for a single country, the CSV should look like this:
            </p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>country_id, link_title, link_url, description</code>

              <code>JAM, Highlight 1, http://example.com, Project related to Jamaica and SDGs</code>

              <code>BHS, Highlight 1, http://example.com, Project related to Bahamas and SDGs</code>

              <code>BLZ, Highlight 1, http://example.com, Project related to Belize and SDGs</code>

              <code>
                TTO, Highlight 2, http://example.com, Project related to Trinidad and Tobago and
                SDGs
              </code>

              <code>BLZ, Highlight 2, http://example.com, Project related to Belize and SDGs</code>

              <code>BLZ, Highlight 3, http://example.com, Project related to Belize and SDGs</code>

              <code>BHS, Highlight 3, http://example.com, Project related to Bahamas and SDGs</code>

              <code>BHS, Highlight 4, http://example.com, Project related to Bahamas and SDGs</code>

              <code>
                BRB, Highlight 4, http://example.com, Project related to Barbados and SDGs
              </code>
            </div>
          </div>
        </div>
      )}

      {valueType === "other-tools" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Other Tools</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span>{" "}
              <code>name, link, category, description</code>.
            </p>
            <p className="font-semibold">Categories:</p>
            <ul className="ml-5 list-disc">
              <li>Biodiversity</li>
              <li>Blue Economy</li>
              <li>Climate Impacts</li>
              <li>Conservation</li>
              <li>Data</li>
              <li>Energy</li>
              <li>General</li>
              <li>Trade</li>
              <li>Vulnerability</li>
            </ul>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>name, link, category, description</code>
              <code>
                Tool A, http://example.com, Data, A tool for data analysis and visualization.
              </code>
              <code>
                Tool B, http://example2.com, Climate Impacts, A tool for assessing climate impacts.
              </code>
            </div>
          </div>
        </div>
      )}

      {valueType === "collaborators" && (
        <div className="text-sm">
          <h4 className="font-metropolis tracking-tight">Collaborators</h4>
          <div className="space-y-2.5">
            <p>
              <span className="font-semibold">Columns:</span> <code>name, type, link</code>.
            </p>
            <p>
              <span className="font-semibold">Type:</span> The type field should be either{" "}
              <code>Donor</code> or <code>Collaborator</code>.
            </p>
            <p className="font-semibold">Example:</p>
            <div className="flex flex-col bg-gray-100 p-4">
              <code>name, type, link</code>
              <code>John Doe, Donor, http://university.edu</code>
              <code>Jane Smith, Collaborator, http://company.com</code>
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
