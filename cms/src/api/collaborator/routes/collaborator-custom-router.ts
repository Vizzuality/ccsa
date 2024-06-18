export default {
  routes: [
    {
      method: 'POST',
      path: '/collaborators/update-or-create',
      handler: 'collaborator.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
