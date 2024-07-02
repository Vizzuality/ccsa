export default {
  routes: [
    {
      method: 'POST',
      path: '/other-tools/approve-other-tool-suggestion',
      handler: 'other-tool.updateOrCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
