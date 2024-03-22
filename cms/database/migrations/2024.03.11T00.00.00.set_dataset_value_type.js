module.exports = {
  async up(knex) {
    const datasets = await knex('datasets').select('id', 'datum', 'value_type')
      .where(function () {
        this.whereNotNull('datum').orWhereNotNull('unit')
      })
      .whereNull('value_type');

    console.log(`Found ${datasets.length} datasets with null value_type`);

    // for each dataset, set the value_type if it is not set already, based on unit or the first non null value in datum
    for (const dataset of datasets) {
      let valueType = 'text'; // default

      // if unit is present, value type is number
      if (dataset.unit) {
        valueType = 'number';
      } else {
        // cast datum to json
        const datum = JSON.parse(dataset.datum);
        // datum is an array of objects
        // [
        //     {
        //       "iso3": "ABW",
        //       "value": null
        //     },
        // ]
        // find first object in datum where value is not null
        const firstNonNullObject = datum.find(obj => obj.value !== null);
        if (firstNonNullObject === undefined) continue;

        // determine the type of value
        const value = firstNonNullObject.value;

        switch (typeof firstNonNullObject.value) {
          case 'number':
            valueType = 'number';
            break;
          case 'string':
            if (value == "yes" || value == "no") {
              valueType = 'boolean';
            } else {
              valueType = 'text';
            }
            break;
          default:
            valueType = 'text';
        }
      }
      console.log(`Setting value_type for dataset ${dataset.id} to ${valueType}`);
      await knex('datasets').where('id', dataset.id).update({ value_type: valueType });
    }
  },
}
