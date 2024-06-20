module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/projects/update-or-create',
      handler: 'project.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
