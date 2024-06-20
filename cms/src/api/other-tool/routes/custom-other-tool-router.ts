export default {
  routes: [
    {
      method: 'POST',
      path: '/other-tools/update-or-create',
      handler: 'other-tool.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
