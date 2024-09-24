module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/projects/approve-project-suggestion',
      handler: 'project.approveProjectSuggestion',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/projects/import',
      handler: 'project.importProjects',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
