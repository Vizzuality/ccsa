/**
 * other-tool controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::other-tool.other-tool', () => ({
  async approveOtherToolSuggestion(ctx: any) {
    const data = ctx.request.body.data;

    let otherTool;
    if (data.id) {
      const { id, ...payload } = data;
      otherTool = await strapi.entityService.findOne('api::other-tool.other-tool', id);

      if (otherTool) {
        otherTool = await strapi.entityService.update('api::other-tool.other-tool', id, { data: payload });
      } else {
        otherTool = await strapi.entityService.create('api::other-tool.other-tool', { data: payload });
      }
    } else {
      otherTool = await strapi.entityService.create('api::other-tool.other-tool', { data });
    }
    ctx.send(otherTool);
  },
}));
