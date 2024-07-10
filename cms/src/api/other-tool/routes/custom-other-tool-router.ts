export default {
  routes: [
    {
      method: 'POST',
      path: '/other-tools/approve-other-tool-suggestion',
      handler: 'other-tool.approveOtherToolSuggestion',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
