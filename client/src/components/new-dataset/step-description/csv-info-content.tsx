import { VALUE_TYPE } from "@/components/forms/dataset/types";

export default function CSVInfoContent({ valueType }: { valueType: VALUE_TYPE }) {
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

      <p className="note">
        If you are not sure how to proceed, you can download a template on this page with all
        available countries to fill in the values.
      </p>
    </div>
  );
}
