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
  async approveDatasetSuggestion(ctx) {
    const { data } = ctx.request.body;
    const { dataset_id, name, description, value_type, dataset_values = [], layers = [], category_ids = [] } = data;

    const datasetData = { name, description, value_type };
    const currentTime = new Date();

    const knex = strapi.db.connection;
    const trx = await knex.transaction();

    try {
      let dataset;
      if (dataset_id) {
        // Update existing dataset
        dataset = await trx('datasets')
          .where({ id: dataset_id })
          .update({
            ...datasetData,
            updated_at: currentTime,
          })
          .returning('*')
          .then(rows => rows[0]);
      } else {
        // Create new dataset
        dataset = await trx('datasets')
          .insert({
            ...datasetData,
            created_at: currentTime,
            updated_at: currentTime,
            published_at: currentTime,
          })
          .returning('*')
          .then(rows => rows[0]);
      }

      let createdDatasetValues = [];
      if (dataset_values.length > 0) {
        // Remove existing dataset values and links if updating
        if (dataset_id) {
          const existingDatasetValues = await trx('dataset_values')
            .join('dataset_values_dataset_links', 'dataset_values.id', '=', 'dataset_values_dataset_links.dataset_value_id')
            .where({ 'dataset_values_dataset_links.dataset_id': dataset_id })
            .select('dataset_values.id');

          const existingDatasetValueIds = existingDatasetValues.map(dv => dv.id);

          // Remove linked resources
          const existingResourceIds = await trx('dataset_values_resources_links')
            .whereIn('dataset_value_id', existingDatasetValueIds)
            .select('resource_id');

          if (existingResourceIds.length > 0) {
            const resourceIdsToDelete = existingResourceIds.map(r => r.resource_id);

            await trx('resources')
              .whereIn('id', resourceIdsToDelete)
              .del();
          }

          await trx('dataset_values_country_links')
            .whereIn('dataset_value_id', existingDatasetValueIds)
            .del();

          await trx('dataset_values_resources_links')
            .whereIn('dataset_value_id', existingDatasetValueIds)
            .del();

          await trx('dataset_values_dataset_links')
            .where({ dataset_id: dataset_id })
            .del();

          await trx('dataset_values')
            .whereIn('id', existingDatasetValueIds)
            .del();
        }

        // Handle DatasetValues creation with Resources and Country Links
        createdDatasetValues = await Promise.all(dataset_values.map(async (value) => {
          // Find the country by iso_3
          const country = await trx('countries')
            .where({ iso_3: value.country })
            .first();

          if (!country) {
            throw new Error(`Country with iso_3 ${value.country} not found`);
          }

          const datasetValueData = {
            created_at: currentTime,
            updated_at: currentTime,
            value_text: value.value_text || null,
            value_number: value.value_number || null,
          };

          const newValue = await trx('dataset_values')
            .insert(datasetValueData)
            .returning('*')
            .then(rows => rows[0]);

          // Insert into dataset_values_country_links
          await trx('dataset_values_country_links')
            .insert({
              dataset_value_id: newValue.id,
              country_id: country.id
            });

          // Create resources if received:
          if (value.resources && value.resources.length > 0) {
            const createdResources = await Promise.all(value.resources.map(async (resource: any) => {
              const newResource = await trx('resources')
                .insert({
                  ...resource,
                  created_at: currentTime,
                  updated_at: currentTime,
                  published_at: currentTime,
                })
                .returning('*')
                .then(rows => rows[0]);

              return newResource.id;
            }));

            // Insert into dataset_values_resources_links
            await Promise.all(createdResources.map(async (resourceId: number) => {
              await trx('dataset_values_resources_links')
                .insert({
                  dataset_value_id: newValue.id,
                  resource_id: resourceId
                });
            }));
          }

          // Insert into dataset_values_dataset_links
          await trx('dataset_values_dataset_links')
            .insert({
              dataset_value_id: newValue.id,
              dataset_id: dataset.id
            });

          return newValue;
        }));
      }

      let layerIds = [];
      if (layers.length > 0) {
        // Handle Layers creation or linking
        layerIds = await Promise.all(layers.map(async (layer: any) => {
          const layerData = {
            ...layer,
            config: JSON.stringify(layer.config),
            params_config: JSON.stringify(layer.params_config),
            legend_config: JSON.stringify(layer.legend_config),
            interaction_config: JSON.stringify(layer.interaction_config),
            created_at: currentTime,
            updated_at: currentTime,
            published_at: currentTime,
          };

          if (layer.layer_id) {
            // Remove existing relation between dataset and layer
            await trx('layers_dataset_links')
              .where({ dataset_id: dataset.id })
              .del();

            // Link new layer
            await trx('layers_dataset_links')
              .insert({
                dataset_id: dataset.id,
                layer_id: layer.layer_id
              });

            return layer.layer_id;
          } else {
            // Remove existing relation between dataset and any
            await trx('layers_dataset_links')
              .where({ dataset_id: dataset.id })
              .del();
            // Create new layer
            const newLayer = await trx('layers')
              .insert(layerData)
              .returning('*')
              .then(rows => rows[0]);

            await trx('layers_dataset_links')
              .insert({
                dataset_id: dataset.id,
                layer_id: newLayer.id
              });

            return newLayer.id;
          }
        }));
      }

      // Handle Category links
      if (category_ids.length > 0) {
        // Remove existing category links if updating
        if (dataset_id) {
          await trx('datasets_category_links')
            .where({ dataset_id: dataset.id })
            .del();
        }
        await Promise.all(category_ids.map(async (category_id: number) => {
          await trx('datasets_category_links')
            .insert({
              dataset_id: dataset.id,
              category_id: category_id
            });
        }));
      }

      await trx.commit();
      ctx.body = dataset;
    } catch (err) {
      await trx.rollback();
      ctx.throw(400, err);
    }
  },
}));
