import csv from 'csv-parser';
import fs from 'fs';
import { Parser } from 'json2csv';


// Function to fetch valid country IDs
async function fetchValidCountryIds() {
  const countries: any = await strapi.entityService.findMany('api::country.country', {
    fields: ['iso3'],
  });
  return countries.map(country => country.iso3);
}

// Helper functions for CSV validation
function validateNumberCsv(data, validCountryIds) {
  for (const row of data) {
    if (!validCountryIds.includes(row.country_id)) return false;
    if (isNaN(Number(row.number))) return false;
  }
  return true;
}

function validateTextCsv(data, validCountryIds) {
  for (const row of data) {
    if (!validCountryIds.includes(row.country_id)) return false;
    if (typeof row.text !== 'string') return false;
  }
  return true;
}

function validateBooleanCsv(data, validCountryIds) {
  for (const row of data) {
    if (!validCountryIds.includes(row.country_id)) return false;
    if (typeof row.boolean !== 'boolean') return false;
  }
  return true;
}

function validateLinkCsv(data, validCountryIds) {
  for (const row of data) {
    if (!validCountryIds.includes(row.country_id)) return false;
    if (typeof row.link_title !== 'string') return false;
    if (typeof row.link_url !== 'string') return false;
    if (typeof row.description !== 'string') return false;
  }
  return true;
}

// Refactored function to determine CSV type and validate structure
function determineCsvTypeAndValidateStructure(columns) {
  const csvTypeMapping = {
    'country_id,number': 'number',
    'country_id,text': 'text',
    'country_id,boolean': 'boolean',
    'country_id,link_title,link_url,description': 'link'
  };

  const columnsKey = columns.join(',');
  return csvTypeMapping[columnsKey] || null;
}

export default {
  async csvToJson(ctx) {
    const files = ctx.request.files;

    if (!files || !files.csv) {
      strapi.log.error('No file provided'); // Debugging line
      return ctx.badRequest('No file provided');
    }

    try {
      const validCountryIds = await fetchValidCountryIds();
      const results = [];

      return new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(files.csv.path);

        readStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('headers', (headers) => {
            // Validate CSV structure based on headers
            const csvType = determineCsvTypeAndValidateStructure(headers);
            if (!csvType) {
              readStream.destroy();
              resolve();
              return ctx.badRequest('CSV validation failed');
            }

            // Store CSV type in context for later use
            ctx.state.csvType = csvType;
          })
          .on('end', () => {
            // Determine CSV type and validate
            const csvType = ctx.state.csvType;
            let isValid = false;

            switch (csvType) {
              case 'number':
                isValid = validateNumberCsv(results, validCountryIds);
                break;
              case 'text':
                isValid = validateTextCsv(results, validCountryIds);
                break;
              case 'boolean':
                isValid = validateBooleanCsv(results, validCountryIds);
                break;
              case 'link':
                isValid = validateLinkCsv(results, validCountryIds);
                break;
              default:
                resolve();
                return ctx.badRequest('Invalid CSV structure');
            }

            if (!isValid) {
              resolve();
              return ctx.badRequest('CSV validation failed');
            }

            ctx.send({ data: results });
            resolve();
          })
          .on('error', (error) => {
            strapi.log.error('CSV Parsing Error:', error);
            ctx.status = 400;
            ctx.body = { message: 'Failed to parse CSV', error };
            resolve();
          });
      });
    } catch (error) {
      console.error('Error:', error);
      ctx.status = 500;
      ctx.body = { message: 'Internal server error', error };
    }
  },

  async jsonToCsv(ctx) {
    const jsonData = ctx.request.body;

    if (!jsonData || typeof jsonData !== 'object') {
      return ctx.badRequest('Invalid JSON data');
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(jsonData);
      ctx.set('Content-Type', 'text/csv');
      ctx.send(csv);
    } catch (error) {
      strapi.log.error('JSON to CSV Conversion Error:', error);
      ctx.badRequest('Failed to convert JSON to CSV', error);
    }
  },
};
