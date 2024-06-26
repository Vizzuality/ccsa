/**
 * tool-edit-suggestion router
 */

import { factories } from "@strapi/strapi";

const isOwner = {
  name: "global::isOwner",
  config: { contentType: "tool-edit-suggestion" },
};

export default factories.createCoreRouter("api::tool-edit-suggestion.tool-edit-suggestion", {
  config: {
    create: {
      policies: [isOwner],
    },
    update: {
      policies: [isOwner],
    },
    delete: {
      policies: [isOwner],
    },
    find: {
      policies: [isOwner],
    },
    findOne: {
      policies: [isOwner],
    },
  },
});
