import type { Schema, Attribute } from "@strapi/strapi";

export interface AdminPermission extends Schema.CollectionType {
  collectionName: "admin_permissions";
  info: {
    name: "Permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<"admin::permission", "manyToOne", "admin::role">;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: "admin_users";
  info: {
    name: "User";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<"admin::user", "manyToMany", "admin::role"> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"admin::user", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: "admin_roles";
  info: {
    name: "Role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<"admin::role", "manyToMany", "admin::user">;
    permissions: Attribute.Relation<
      "admin::role",
      "oneToMany",
      "admin::permission"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"admin::role", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: "strapi_api_tokens";
  info: {
    name: "Api Token";
    singularName: "api-token";
    pluralName: "api-tokens";
    displayName: "Api Token";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    type: Attribute.Enumeration<["read-only", "full-access", "custom"]> &
      Attribute.Required &
      Attribute.DefaultTo<"read-only">;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      "admin::api-token",
      "oneToMany",
      "admin::api-token-permission"
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_api_token_permissions";
  info: {
    name: "API Token Permission";
    description: "";
    singularName: "api-token-permission";
    pluralName: "api-token-permissions";
    displayName: "API Token Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      "admin::api-token-permission",
      "manyToOne",
      "admin::api-token"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: "strapi_transfer_tokens";
  info: {
    name: "Transfer Token";
    singularName: "transfer-token";
    pluralName: "transfer-tokens";
    displayName: "Transfer Token";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<"">;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      "admin::transfer-token",
      "oneToMany",
      "admin::transfer-token-permission"
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::transfer-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::transfer-token",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: "strapi_transfer_token_permissions";
  info: {
    name: "Transfer Token Permission";
    description: "";
    singularName: "transfer-token-permission";
    pluralName: "transfer-token-permissions";
    displayName: "Transfer Token Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      "admin::transfer-token-permission",
      "manyToOne",
      "admin::transfer-token"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "admin::transfer-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "admin::transfer-token-permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: "files";
  info: {
    singularName: "file";
    pluralName: "files";
    displayName: "File";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<"plugin::upload.file", "morphToMany">;
    folder: Attribute.Relation<
      "plugin::upload.file",
      "manyToOne",
      "plugin::upload.folder"
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: "upload_folders";
  info: {
    singularName: "folder";
    pluralName: "folders";
    displayName: "Folder";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      "plugin::upload.folder",
      "manyToOne",
      "plugin::upload.folder"
    >;
    children: Attribute.Relation<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.folder"
    >;
    files: Attribute.Relation<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.file"
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: "i18n_locale";
  info: {
    singularName: "locale";
    pluralName: "locales";
    collectionName: "locales";
    displayName: "Locale";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::i18n.locale",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::i18n.locale",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: "up_permissions";
  info: {
    name: "permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      "plugin::users-permissions.permission",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: "up_roles";
  info: {
    name: "role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.permission"
    >;
    users: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.user"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: "up_users";
  info: {
    name: "user";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      "plugin::users-permissions.user",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    organization: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: "categories";
  info: {
    singularName: "category";
    pluralName: "categories";
    displayName: "Category";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    datasets: Attribute.Relation<
      "api::category.category",
      "oneToMany",
      "api::dataset.dataset"
    >;
    dataset_edit_suggestions: Attribute.Relation<
      "api::category.category",
      "oneToMany",
      "api::dataset-edit-suggestion.dataset-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::category.category",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::category.category",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiCollaboratorCollaborator extends Schema.CollectionType {
  collectionName: "collaborators";
  info: {
    singularName: "collaborator";
    pluralName: "collaborators";
    displayName: "Collaborator";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    link: Attribute.String;
    type: Attribute.Enumeration<["donor", "collaborator"]> & Attribute.Required;
    collaborator_edit_suggestions: Attribute.Relation<
      "api::collaborator.collaborator",
      "oneToMany",
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::collaborator.collaborator",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::collaborator.collaborator",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiCollaboratorEditSuggestionCollaboratorEditSuggestion
  extends Schema.CollectionType {
  collectionName: "collaborator_edit_suggestions";
  info: {
    singularName: "collaborator-edit-suggestion";
    pluralName: "collaborator-edit-suggestions";
    displayName: "Collaborator Edit Suggestion";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    link: Attribute.String;
    type: Attribute.Enumeration<["donor", "collaborator"]>;
    review_status: Attribute.Enumeration<["pending", "approved", "declined"]> &
      Attribute.Required &
      Attribute.DefaultTo<"pending">;
    author: Attribute.Relation<
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion",
      "oneToOne",
      "plugin::users-permissions.user"
    >;
    collaborator: Attribute.Relation<
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion",
      "manyToOne",
      "api::collaborator.collaborator"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiCountryCountry extends Schema.CollectionType {
  collectionName: "countries";
  info: {
    singularName: "country";
    pluralName: "countries";
    displayName: "Country";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    iso3: Attribute.String & Attribute.Required & Attribute.Unique;
    geometry: Attribute.JSON;
    bbox: Attribute.JSON;
    link: Attribute.String;
    dataset_values: Attribute.Relation<
      "api::country.country",
      "oneToMany",
      "api::dataset-value.dataset-value"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::country.country",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::country.country",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiDatasetDataset extends Schema.CollectionType {
  collectionName: "datasets";
  info: {
    singularName: "dataset";
    pluralName: "datasets";
    displayName: "Dataset";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    datum: Attribute.JSON & Attribute.Required;
    category: Attribute.Relation<
      "api::dataset.dataset",
      "manyToOne",
      "api::category.category"
    >;
    description: Attribute.RichText & Attribute.Required;
    layers: Attribute.Relation<
      "api::dataset.dataset",
      "oneToMany",
      "api::layer.layer"
    >;
    unit: Attribute.String;
    value_type: Attribute.Enumeration<
      ["text", "number", "boolean", "resource"]
    > &
      Attribute.Required;
    dataset_edit_suggestions: Attribute.Relation<
      "api::dataset.dataset",
      "oneToMany",
      "api::dataset-edit-suggestion.dataset-edit-suggestion"
    >;
    dataset_values: Attribute.Relation<
      "api::dataset.dataset",
      "oneToMany",
      "api::dataset-value.dataset-value"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::dataset.dataset",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::dataset.dataset",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiDatasetEditSuggestionDatasetEditSuggestion
  extends Schema.CollectionType {
  collectionName: "dataset_edit_suggestions";
  info: {
    singularName: "dataset-edit-suggestion";
    pluralName: "dataset-edit-suggestions";
    displayName: "Dataset Edit Suggestion";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    data: Attribute.JSON;
    description: Attribute.RichText;
    unit: Attribute.String;
    value_type: Attribute.Enumeration<
      ["text", "number", "boolean", "resource"]
    >;
    review_status: Attribute.Enumeration<["pending", "approved", "declined"]> &
      Attribute.Required &
      Attribute.DefaultTo<"pending">;
    dataset: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "manyToOne",
      "api::dataset.dataset"
    >;
    author: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "oneToOne",
      "plugin::users-permissions.user"
    >;
    category: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "manyToOne",
      "api::category.category"
    >;
    layers: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "oneToMany",
      "api::layer.layer"
    >;
    dataset: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "manyToOne",
      "api::dataset.dataset"
    >;
    colors: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::dataset-edit-suggestion.dataset-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiDatasetValueDatasetValue extends Schema.CollectionType {
  collectionName: "dataset_values";
  info: {
    singularName: "dataset-value";
    pluralName: "dataset-values";
    displayName: "DatasetValue";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    dataset: Attribute.Relation<
      "api::dataset-value.dataset-value",
      "manyToOne",
      "api::dataset.dataset"
    >;
    country: Attribute.Relation<
      "api::dataset-value.dataset-value",
      "manyToOne",
      "api::country.country"
    >;
    value_text: Attribute.String;
    value_number: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    value_boolean: Attribute.Boolean;
    resources: Attribute.Relation<
      "api::dataset-value.dataset-value",
      "oneToMany",
      "api::resource.resource"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::dataset-value.dataset-value",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::dataset-value.dataset-value",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiDownloadEmailDownloadEmail extends Schema.CollectionType {
  collectionName: "download_emails";
  info: {
    singularName: "download-email";
    pluralName: "download-emails";
    displayName: "Download Email";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    downloads: Attribute.Integer & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::download-email.download-email",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::download-email.download-email",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiLayerLayer extends Schema.CollectionType {
  collectionName: "layers";
  info: {
    singularName: "layer";
    pluralName: "layers";
    displayName: "Layer";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    type: Attribute.Enumeration<
      ["mapbox", "deckgl", "countries", "component"]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"mapbox">;
    config: Attribute.JSON & Attribute.Required;
    params_config: Attribute.JSON & Attribute.Required;
    legend_config: Attribute.JSON & Attribute.Required;
    interaction_config: Attribute.JSON & Attribute.Required;
    dataset: Attribute.Relation<
      "api::layer.layer",
      "manyToOne",
      "api::dataset.dataset"
    >;
    colors: Attribute.JSON;
    dataset_edit_suggestion: Attribute.Relation<
      "api::layer.layer",
      "manyToOne",
      "api::dataset-edit-suggestion.dataset-edit-suggestion"
    >;
    colors: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::layer.layer",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::layer.layer",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiOtherToolOtherTool extends Schema.CollectionType {
  collectionName: "other_tools";
  info: {
    singularName: "other-tool";
    pluralName: "other-tools";
    displayName: "Other Tools";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.String;
    link: Attribute.String & Attribute.Required;
    other_tools_category: Attribute.Relation<
      "api::other-tool.other-tool",
      "oneToOne",
      "api::other-tools-category.other-tools-category"
    >;
    tool_edit_suggestions: Attribute.Relation<
      "api::other-tool.other-tool",
      "oneToMany",
      "api::tool-edit-suggestion.tool-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::other-tool.other-tool",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::other-tool.other-tool",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiOtherToolsCategoryOtherToolsCategory
  extends Schema.CollectionType {
  collectionName: "other_tools_categories";
  info: {
    singularName: "other-tools-category";
    pluralName: "other-tools-categories";
    displayName: "Other Tools Category";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::other-tools-category.other-tools-category",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::other-tools-category.other-tools-category",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiPillarPillar extends Schema.CollectionType {
  collectionName: "pillars";
  info: {
    singularName: "pillar";
    pluralName: "pillars";
    displayName: "Pillar";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    projects: Attribute.Relation<
      "api::pillar.pillar",
      "oneToMany",
      "api::project.project"
    >;
    description: Attribute.RichText & Attribute.Required;
    project_edit_suggestions: Attribute.Relation<
      "api::pillar.pillar",
      "oneToMany",
      "api::project-edit-suggestion.project-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::pillar.pillar",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::pillar.pillar",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiProjectProject extends Schema.CollectionType {
  collectionName: "projects";
  info: {
    singularName: "project";
    pluralName: "projects";
    displayName: "Project";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    countries: Attribute.Relation<
      "api::project.project",
      "oneToMany",
      "api::country.country"
    >;
    pillar: Attribute.Relation<
      "api::project.project",
      "manyToOne",
      "api::pillar.pillar"
    >;
    highlight: Attribute.RichText;
    account: Attribute.String;
    amount: Attribute.Float;
    sdgs: Attribute.Relation<
      "api::project.project",
      "manyToMany",
      "api::sdg.sdg"
    >;
    status: Attribute.String;
    funding: Attribute.String;
    source_country: Attribute.String;
    organization_type: Attribute.String;
    objective: Attribute.Text;
    info: Attribute.String;
    project_edit_suggestions: Attribute.Relation<
      "api::project.project",
      "oneToMany",
      "api::project-edit-suggestion.project-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::project.project",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::project.project",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiProjectEditSuggestionProjectEditSuggestion
  extends Schema.CollectionType {
  collectionName: "project_edit_suggestions";
  info: {
    singularName: "project-edit-suggestion";
    pluralName: "project-edit-suggestions";
    displayName: "Project Edit Suggestion";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    highlight: Attribute.RichText;
    account: Attribute.String;
    amount: Attribute.Float;
    status: Attribute.String;
    funding: Attribute.String;
    source_country: Attribute.String;
    organization_type: Attribute.String;
    objective: Attribute.Text;
    info: Attribute.String;
    review_status: Attribute.Enumeration<["pending", "approved", "declined"]> &
      Attribute.Required &
      Attribute.DefaultTo<"pending">;
    author: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "oneToOne",
      "plugin::users-permissions.user"
    >;
    countries: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "oneToMany",
      "api::country.country"
    >;
    pillar: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "manyToOne",
      "api::pillar.pillar"
    >;
    sdgs: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "manyToMany",
      "api::sdg.sdg"
    >;
    project: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "manyToOne",
      "api::project.project"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::project-edit-suggestion.project-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiResourceResource extends Schema.CollectionType {
  collectionName: "resources";
  info: {
    singularName: "resource";
    pluralName: "resources";
    displayName: "Resource";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    link_title: Attribute.String & Attribute.Required;
    link_url: Attribute.Text & Attribute.Required;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::resource.resource",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::resource.resource",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiSdgSdg extends Schema.CollectionType {
  collectionName: "sdgs";
  info: {
    singularName: "sdg";
    pluralName: "sdgs";
    displayName: "SDG";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    projects: Attribute.Relation<
      "api::sdg.sdg",
      "manyToMany",
      "api::project.project"
    >;
    project_edit_suggestions: Attribute.Relation<
      "api::sdg.sdg",
      "manyToMany",
      "api::project-edit-suggestion.project-edit-suggestion"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<"api::sdg.sdg", "oneToOne", "admin::user"> &
      Attribute.Private;
    updatedBy: Attribute.Relation<"api::sdg.sdg", "oneToOne", "admin::user"> &
      Attribute.Private;
  };
}

export interface ApiToolEditSuggestionToolEditSuggestion
  extends Schema.CollectionType {
  collectionName: "tool_edit_suggestions";
  info: {
    singularName: "tool-edit-suggestion";
    pluralName: "tool-edit-suggestions";
    displayName: "Tool Edit Suggestion";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.String;
    link: Attribute.String;
    review_status: Attribute.Enumeration<["pending", "approved", "declined"]> &
      Attribute.Required &
      Attribute.DefaultTo<"pending">;
    author: Attribute.Relation<
      "api::tool-edit-suggestion.tool-edit-suggestion",
      "oneToOne",
      "plugin::users-permissions.user"
    >;
    other_tools_category: Attribute.Relation<
      "api::tool-edit-suggestion.tool-edit-suggestion",
      "oneToOne",
      "api::other-tools-category.other-tools-category"
    >;
    other_tool: Attribute.Relation<
      "api::tool-edit-suggestion.tool-edit-suggestion",
      "manyToOne",
      "api::other-tool.other-tool"
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::tool-edit-suggestion.tool-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::tool-edit-suggestion.tool-edit-suggestion",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

export interface ApiWelcomeMessageWelcomeMessage extends Schema.SingleType {
  collectionName: "welcome_messages";
  info: {
    singularName: "welcome-message";
    pluralName: "welcome-messages";
    displayName: "Welcome message";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.Text;
    subtitle: Attribute.Text;
    video: Attribute.Media;
    image: Attribute.Media;
    button: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      "api::welcome-message.welcome-message",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      "api::welcome-message.welcome-message",
      "oneToOne",
      "admin::user"
    > &
      Attribute.Private;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface ContentTypes {
      "admin::permission": AdminPermission;
      "admin::user": AdminUser;
      "admin::role": AdminRole;
      "admin::api-token": AdminApiToken;
      "admin::api-token-permission": AdminApiTokenPermission;
      "admin::transfer-token": AdminTransferToken;
      "admin::transfer-token-permission": AdminTransferTokenPermission;
      "plugin::upload.file": PluginUploadFile;
      "plugin::upload.folder": PluginUploadFolder;
      "plugin::i18n.locale": PluginI18NLocale;
      "plugin::users-permissions.permission": PluginUsersPermissionsPermission;
      "plugin::users-permissions.role": PluginUsersPermissionsRole;
      "plugin::users-permissions.user": PluginUsersPermissionsUser;
      "api::category.category": ApiCategoryCategory;
      "api::collaborator.collaborator": ApiCollaboratorCollaborator;
      "api::collaborator-edit-suggestion.collaborator-edit-suggestion": ApiCollaboratorEditSuggestionCollaboratorEditSuggestion;
      "api::country.country": ApiCountryCountry;
      "api::dataset.dataset": ApiDatasetDataset;
      "api::dataset-edit-suggestion.dataset-edit-suggestion": ApiDatasetEditSuggestionDatasetEditSuggestion;
      "api::dataset-value.dataset-value": ApiDatasetValueDatasetValue;
      "api::download-email.download-email": ApiDownloadEmailDownloadEmail;
      "api::layer.layer": ApiLayerLayer;
      "api::other-tool.other-tool": ApiOtherToolOtherTool;
      "api::other-tools-category.other-tools-category": ApiOtherToolsCategoryOtherToolsCategory;
      "api::pillar.pillar": ApiPillarPillar;
      "api::project.project": ApiProjectProject;
      "api::project-edit-suggestion.project-edit-suggestion": ApiProjectEditSuggestionProjectEditSuggestion;
      "api::resource.resource": ApiResourceResource;
      "api::sdg.sdg": ApiSdgSdg;
      "api::tool-edit-suggestion.tool-edit-suggestion": ApiToolEditSuggestionToolEditSuggestion;
      "api::welcome-message.welcome-message": ApiWelcomeMessageWelcomeMessage;
    }
  }
}
