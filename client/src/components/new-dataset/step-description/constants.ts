// Columns, descriptions and examples for projects come from the CMS at
// /projects/import-template?format=json, so the dialog and the downloadable
// template cannot drift apart.
export const PROJECTS_CSV_CONTENT = {
  title: "Project/s",
};

export const OTHER_TOOLS_CSV_CONTENT = {
  title: "Other Tools",
  columns: ["name", "description", "link", "other_tools_category"],
  examples: [
    "Tool A, A tool for data analysis and visualization., http://example.com, Data",
    "Tool B, A tool for assessing climate impacts., http://example2.com, Climate Impacts",
  ],
};

export const COLLABORATORS_CSV_CONTENT = {
  title: "Collaborators",
  columns: ["name", "type", "link"],
  examples: [
    "John Doe, Donor, http://university.edu",
    "Jane Smith, Collaborator, http://company.com",
  ],
};

export const LINK_CSV_CONTENT = {
  title: "Link",
  columns: ["country_id", "link_title", "link_url", "description"],
  examples: [
    "AIA, Title 1, http://example1.com, Description 1",
    "AIA, Title 2, http://example2.com, Description 2",
    "MEX, Title 3, http://example3.com, Description 3",
    "VIR, Title 4, http://example4.com, Description 4",
  ],
};
