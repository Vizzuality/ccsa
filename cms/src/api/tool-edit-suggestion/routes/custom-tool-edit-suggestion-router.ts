export default {
  routes: [
    {
      method: 'POST',
      path: '/tool-edit-suggestions/import',
      handler: 'tool-edit-suggestion.importOtherToolsEditSuggestions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
