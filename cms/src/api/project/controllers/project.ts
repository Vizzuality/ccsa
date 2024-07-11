/**
 * project controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::project.project', () => ({
  async approveProjectSuggestion(ctx) {
    const data = ctx.request.body.data;
    let project;
    const currentDate = new Date();

    if (data.id) {
      const { id, ...payload } = ctx.request.body.data
      project = await strapi.entityService.findOne('api::project.project', id);

      if (project) {

        project = await strapi.entityService.update('api::project.project', id, { data: { ...payload, publishedAt: currentDate } });
      } else {
        project = await strapi.entityService.create('api::project.project', { data: { ...payload, publishedAt: currentDate } });
      }
    } else {
      project = await strapi.entityService.create('api::project.project',  { data: { ...data, publishedAt: currentDate } });
    }
    ctx.send(project);
  },
}));
