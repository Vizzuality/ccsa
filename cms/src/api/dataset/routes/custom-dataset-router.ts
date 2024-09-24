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
    {
      method: 'POST',
      path: '/datasets/approve-dataset-suggestion',
      handler: 'dataset.approveDatasetSuggestion',
      config: {
        policies: [],
        middlewares: [],
      },
    },

  ],
};
