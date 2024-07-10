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
  ],
};
