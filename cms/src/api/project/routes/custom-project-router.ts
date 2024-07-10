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
  ],
};
