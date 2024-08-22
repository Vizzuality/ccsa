/**
 * other-tool controller
 */

import { factories } from '@strapi/strapi'
import axios from 'axios';
import * as fs from 'fs';

export default factories.createCoreController('api::other-tool.other-tool', () => ({
  async approveOtherToolSuggestion(ctx: any) {
    const data = ctx.request.body.data;

    let otherTool;
    const currentDate = new Date();

    if (data.id) {
      const { id, ...payload } = data;
      otherTool = await strapi.entityService.findOne('api::other-tool.other-tool', id);

      if (otherTool) {
        otherTool = await strapi.entityService.update('api::other-tool.other-tool', id, { data: { ...payload, publishedAt: currentDate } });
      } else {
        otherTool = await strapi.entityService.create('api::other-tool.other-tool', { data: { ...payload, publishedAt: currentDate } });
      }
    } else {
      otherTool = await strapi.entityService.create('api::other-tool.other-tool', { data: { ...data, publishedAt: currentDate } });
    }
    ctx.send(otherTool);
  },

  async importOtherTools(ctx) {
    const { file } = ctx.request.files as { file: any }; // Assuming file is uploaded as 'file'
    if (!file) {
      return ctx.badRequest('No file uploaded');
    }

    try {
      // Use the service to parse and replace IDs, including the authorId from the user state
      const { csvData, rowCount } = await strapi
        .service('api::other-tool.other-tool')
        .parseAndReplaceIds(file);

      // Prepare the data for the import endpoint
      const importData = {
        slug: 'api::other-tool.other-tool',
        data: csvData,
        format: 'csv',
        idField: 'id',
      };

      // Post the data to the import plugin
      const response = await axios.post(
        `${strapi.config.server.url}/api/import-export-entries/content/import`,
        importData,
        {
          headers: {
            Authorization: `${ctx.req.rawHeaders[1] || ''}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Return the response from the import plugin
      ctx.send({
        message: 'File processed and imported successfully',
        toolsImported: rowCount,
        data: response.data,
      });
    } catch (error: any) {
      ctx.throw(500, `Failed to import data: ${error.message}`);
    } finally {
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
    }
  },
}));
