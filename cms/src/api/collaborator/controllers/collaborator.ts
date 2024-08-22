/**
 * collaborator controller
 */

import { factories } from '@strapi/strapi'
import axios from 'axios';
import * as fs from 'fs';

export default factories.createCoreController('api::collaborator.collaborator', () => ({
  async approveCollaboratorSuggestion(ctx: any) {
    const data = ctx.request.body.data;

    let collaborator;
    const currentDate = new Date();

    if (data.id) {
      const { id, ...payload } = data;
      collaborator = await strapi.entityService.findOne('api::collaborator.collaborator', id);

      if (collaborator) {
        collaborator = await strapi.entityService.update('api::collaborator.collaborator', id, { data: payload });
      } else {
        collaborator = await strapi.entityService.create('api::collaborator.collaborator', { data: { ...payload, publishedAt: currentDate } });
      }
    } else {
      collaborator = await strapi.entityService.create('api::collaborator.collaborator', { data: { ...data, publishedAt: currentDate } });
    }
    ctx.send(collaborator);
  },

  async importCollaborators(ctx) {
    const { file } = ctx.request.files as { file: any }; // Assuming file is uploaded as 'file'

    if (!file) {
      return ctx.badRequest('No file uploaded');
    }

    try {
      // Use the service to parse and prepare CSV data, including the authorId from the user state
      const { csvData, rowCount } = await strapi
        .service('api::collaborator.collaborator')
        .parseAndPrepareCSV(file);

      // Prepare the data for the import endpoint
      const importData = {
        slug: 'api::collaborator.collaborator',
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
      ctx.send({
        message: 'File processed and imported successfully',
        collaboratorsImported: rowCount,
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
