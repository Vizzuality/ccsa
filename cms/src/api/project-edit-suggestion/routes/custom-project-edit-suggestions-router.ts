module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/project-edit-suggestions/import',
      handler: 'project-edit-suggestion.importProjectsSuggestions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
