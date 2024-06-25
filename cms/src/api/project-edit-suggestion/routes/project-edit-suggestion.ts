/**
 * project-edit-suggestion router
 */

import { factories } from "@strapi/strapi";

const isOwner = {
  name: "global::isOwner",
  config: { contentType: "project-edit-suggestion" },
};

export default factories.createCoreRouter("api::project-edit-suggestion.project-edit-suggestion", {
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

