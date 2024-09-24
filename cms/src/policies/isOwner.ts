const { PolicyError } = require("@strapi/utils").errors;

/**
 * `isOwner` policy.
 * CAUTION: This policy only applies to the REST API, GraphQL is unrestricted!!!
 */

export default async (ctx, config, { strapi }) => {
  const user = ctx.state.user;
  if (!user.id) {
    throw new PolicyError("You must be logged in to access this resource", {});
  }

  // create
  if (["POST"].includes(ctx.request.method) && !ctx.params.id) {
    ctx.request.body.data.author = user.id
  }
  // find
  else if (["GET"].includes(ctx.request.method) && !ctx.params.id) {
    if (user.role.name !== 'Admin') {
      ctx.request.query.filters = {
        ...(ctx.request.query.filters || {}),
        author: { id: user.id },
      };
    }
  }
  // findOne, update, delete
  else if (["PUT", "DELETE", "GET"].includes(ctx.request.method) && ctx.params.id) {
    let entity = await strapi.entityService.findOne(
      `api::${config.contentType}.${config.contentType}`,
      ctx.params.id,
      {
        // fields: ['owner'],
        populate: { author: true }, // enable this if owner is a Relation
      }
    );
    if (!entity) {
      throw new PolicyError("This entity does not exist", {});
    } else if (user.role.name !== 'Admin' && entity.author.id !== user.id) {
      throw new PolicyError(
        "You do not have permission to access this entity",
        {}
      );
    }
  } else {
    throw new PolicyError("This request is not supported", {});
  }

  return true;
};
