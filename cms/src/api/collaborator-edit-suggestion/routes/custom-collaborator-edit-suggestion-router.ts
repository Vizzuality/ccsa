export default {
  routes: [
    {
      method: 'POST',
      path: '/collaborator-edit-suggestions/import',
      handler: 'collaborator-edit-suggestion.importCollaboratorEditSuggestions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
