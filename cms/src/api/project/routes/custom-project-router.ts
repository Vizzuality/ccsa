module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/projects/approve-project-suggestion',
      handler: 'project.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
