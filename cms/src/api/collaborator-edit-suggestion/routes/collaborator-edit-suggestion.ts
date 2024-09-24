/**
 * collaborator-edit-suggestion router
 */

import { factories } from "@strapi/strapi";

const isOwner = {
  name: "global::isOwner",
  config: { contentType: "collaborator-edit-suggestion" },
};

export default factories.createCoreRouter("api::collaborator-edit-suggestion.collaborator-edit-suggestion", {
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
