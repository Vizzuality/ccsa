/**
 * dataset controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::dataset.dataset', () => ({
  async updateOrCreate(ctx) {
    const data = ctx.request.body.data;

    let dataset;
    if (data.id) {
      const { id, ...payload } = data;
      dataset = await strapi.entityService.findOne('api::dataset.dataset', id);

      if (dataset) {
        dataset = await strapi.entityService.update('api::dataset.dataset', id, { data: payload });
      } else {
        dataset = await strapi.entityService.create('api::dataset.dataset', { data: payload });
      }
    } else {
      dataset = await strapi.entityService.create('api::dataset.dataset', { data });
    }
    ctx.send(dataset);
  },
}));
