export default {
  routes: [
    {
      method: 'POST',
      path: '/collaborators/approve-collaborator-suggestion',
      handler: 'collaborator.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
