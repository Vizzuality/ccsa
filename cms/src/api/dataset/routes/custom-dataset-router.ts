module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/datasets/update-or-create',
      handler: 'dataset.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
