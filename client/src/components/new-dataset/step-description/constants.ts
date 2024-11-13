export const PROJECTS_CSV_CONTENT = {
  title: "Project/s",
  columns: [
    "name",
    "highlight",
    "status",
    "objective",
    "amount",
    "countries",
    "source_country",
    "sdgs",
    "pillar",
    "organization_type",
    "info",
    "funding",
  ],
  examples: [
    "Import test 1, In Execution, Highlight 1, Seeking Collaborative Partnerships, 120000, Jamaica; Bahamas; Belize, The United States, SDG 12 - Responsible production and consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 1.5% New Green Jobs for Physical & Economic Resilience, For-profit, example info 1, Grant",
    "Import test 2, Highlight 2, Completed, Building Public Awareness and Engagement, 120001, Trinidad and Tobago; Belize, Trinidad & Tobago, SDG 7 - Affordable and clean energy; SDG 8 - Decent work and economic growth; SDG 9 - Industry Innovation and Infrastructure; SDG 11 - Sustainable Cities and Communities; SDG 12 - Responsible production and consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 90% Renewable Energy for All, For-profit, example info 2, Loan",
    "Import test 3, Highlight 3, Start-up to Early Stage, An Opportunity to Scale to New jurisdictions, 120002, Belize; Bahamas, Belize, SDG 7 - Affordable and clean energy; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 90% Renewable Energy for All, For-profit, example info 3, Venture Capital",
    "Import test 4, Highlight 4, Start-up to Early Stage, Attracting Investment and Securing Funding, 120003, Bahamas, Barbados, SDG 7 - Affordable and clean energy; SDG 8 - Decent work and economic growth; SDG 9 - Industry Innovation and Infrastructure; SDG 11 - Sustainable Cities and Communities; SDG 12 - Responsible production and consumption; SDG 13 - Climate Action; SDG 17 - Partnership for the goals, 90% Renewable Energy for All, For-profit, example info 3, Venture Debt",
  ],
};

export const OTHER_TOOLS_CSV_CONTENT = {
  title: "Other Tools",
  columns: ["name", "link", "category", "description"],
  categories: [
    "Biodiversity",
    "Blue Economy",
    "Climate Impacts",
    "Conservation",
    "Data",
    "Energy",
    "General",
    "Trade",
    "Vulnerability",
  ],
  examples: [
    "Tool A, http://example.com, Data, A tool for data analysis and visualization.",
    "Tool B, http://example2.com, Climate Impacts, A tool for assessing climate impacts.",
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
