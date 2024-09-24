/**
 * dataset-edit-suggestion router
 */

import { factories } from "@strapi/strapi";

const isOwner = {
  name: "global::isOwner",
  config: { contentType: "dataset-edit-suggestion" },
};

export default factories.createCoreRouter("api::dataset-edit-suggestion.dataset-edit-suggestion", {
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
