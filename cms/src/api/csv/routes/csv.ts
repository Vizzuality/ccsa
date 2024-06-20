export default {
  routes: [
    {
      method: 'POST',
      path: '/csv/parse-csv',
      handler: 'csv.csvToJson',
      config: {
        policies: [],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  files: {
                    type: 'string',
                    format: 'binary',
                  },
                },
                required: ['files'],
              },
            },
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/csv/json-to-csv',
      handler: 'csv.jsonToCsv',
      config: {
        policies: [],
      },
    },
  ],
};
