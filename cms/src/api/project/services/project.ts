/**
 * project service
 */

import {factories} from '@strapi/strapi';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';
import * as stringify from 'csv-stringify/sync';

interface ProjectRow {
  countries: string;
  sdgs: string;
  pillar: string;
  [key: string]: any;
}

async function findCountryIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::country.country', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No country found with the name "${name}"`);
  }

  return result[0].id;
}

async function findSdgIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::sdg.sdg', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No SDG found with the name "${name}"`);
  }

  return result[0].id;
}

async function findPillarIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::pillar.pillar', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No pillar found with the name "${name}"`);
  }

  return result[0].id;
}

export default factories.createCoreService('api::project.project', {
  async parseAndReplaceIds(file, author = null) {
    // Read and parse the CSV file
    const fileContent = fs.readFileSync(file.path, 'utf8');

    const allowedColumns = ['name', 'highlight', 'status', 'objective', 'amount', 'countries', 'source_country', 'sdgs', 'pillar', 'organization_type', 'info', 'funding'];

    const records: ProjectRow[] = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length === 0) {
      throw new Error('CSV file is empty');
    }

    const csvColumns = Object.keys(records[0]);

    const invalidColumns = csvColumns.filter(col => !allowedColumns.includes(col));
    if (invalidColumns.length > 0) {
      throw new Error(`Invalid columns detected: ${invalidColumns.join(', ')}`);
    }

    const missingColumns = allowedColumns.filter(col => !csvColumns.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Process each row
    const updatedRecords = await Promise.all(records.map(async (row: ProjectRow) => {
      const countryNames = row.countries.split(';').map(name => name.trim());
      const sdgNames = row.sdgs.split(';').map(name => name.trim());
      const pillarNames = row.pillar.split(';').map(name => name.trim());

      const countryIds = await Promise.all(countryNames.map(name => findCountryIdByName(name)));
      const sdgIds = await Promise.all(sdgNames.map(name => findSdgIdByName(name)));
      const pillarIds = await Promise.all(pillarNames.map(name => findPillarIdByName(name)));
      const publishedAt = new Date().toISOString();

      const updatedRow: any = {
        ...row,
        countries: countryIds,
        sdgs: sdgIds,
        pillar: pillarIds,
        publishedAt,
      };

      // Add author relation if provided
      if (author) {
        updatedRow.author = [author];
      }

      return updatedRow;
    }));

    const updatedCSV = stringify.stringify(updatedRecords, { header: true });

    return {
      csvData: updatedCSV,
      rowCount: updatedRecords.length,
    };
  },
});
