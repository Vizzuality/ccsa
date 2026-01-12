module.exports = {
  routes: [
    {
      method: "POST",
      path: "/projects/approve-project-suggestion",
      handler: "project.approveProjectSuggestion",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/projects/import",
      handler: "project.importProjects",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/projects/search-by-name",
      handler: "project.searchByNameWholeWord",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
