module.exports = {
  async up(knex) {
    // copy the data from dataset.datum column as rows in dataset_values
    // leave datum in place for now

    // create a dictionary of iso3 => country_id based on countries table
    const countries = await knex('countries').select('id', 'iso_3');
    const country_id_by_iso3 = {};
    for (const country of countries) {
      country_id_by_iso3[country.iso_3] = country.id;
    }

    console.log(country_id_by_iso3);

    // for each dataset
    const datasets = await knex('datasets').select('id', 'datum', 'value_type').whereNotNull('datum').whereNotNull('value_type');
    for (const dataset of datasets) {
      const value_column_name = `value_${dataset.value_type}`;
      console.log(value_column_name);
      values_to_insert = {
        value_text: null,
        value_number: null,
        value_boolean: null
      }

      // datum is a json array of objects
      // [
      //     {
      //       "iso3": "ABW",
      //       "value": null
      //     },
      // ]
      const datum = JSON.parse(dataset.datum);
      console.log(datum);

      for (const { iso3, value } of datum) {
        console.log(iso3, value, country_id_by_iso3[iso3]);
        // if the country is not in the countries table, print error and skip
        if (!country_id_by_iso3[iso3]) {
          console.error(`Country with iso3 ${iso3} not found in countries table`);
          continue;
        }
        // start transaction
        try {
          await knex.transaction(async function (trx) {
            // insert a row into dataset_values
            const dataset_values = await trx('dataset_values').insert({
              // merge values_to_insert with value_column_name => value
              ...values_to_insert,
              [value_column_name]: value
            }).returning('id');
            console.log(dataset_values);
            // insert a row into dataset_values_country_links
            await trx('dataset_values_country_links').insert({
              dataset_value_id: dataset_values[0].id,
              country_id: country_id_by_iso3[iso3]
            });
            // insert a row into dataset_values_dataset_links
            await trx('dataset_values_dataset_links').insert({
              dataset_value_id: dataset_values[0].id,
              dataset_id: dataset.id
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
}
