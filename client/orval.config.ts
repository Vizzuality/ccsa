module.exports = {
  ccsa: {
    output: {
      mode: "tags",
      client: "react-query",
      target: "./src/types/generated/strapi.ts",
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./src/services/api/index.ts",
          name: "API",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    input: {
      target: "../cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json",
      filters: {
        tags: [
          "Project",
          "Dataset",
          "Layer",
          "Country",
          "Category",
          "Pillar",
          "Sdg",
          "Download-email",
          "Other-tool",
          "Dataset-value",
          "Collaborator",
          "Welcome-message",
        ],
      },
    },
  },
};
