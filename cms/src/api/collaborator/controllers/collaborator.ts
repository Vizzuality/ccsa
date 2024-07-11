/**
 * collaborator controller
 */

import { factories } from '@strapi/strapi'

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
}));
