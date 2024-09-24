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
    {
      method: 'POST',
      path: '/other-tools/import',
      handler: 'other-tool.importOtherTools',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
