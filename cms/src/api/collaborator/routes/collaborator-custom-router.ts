export default {
  routes: [
    {
      method: 'POST',
      path: '/collaborators/approve-collaborator-suggestion',
      handler: 'collaborator.approveCollaboratorSuggestion',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/collaborators/import',
      handler: 'collaborator.importCollaborators',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
