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

async function findProjectStatusIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::project-status.project-status', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No project status found with the name "${name}"`);
  }

  return result[0].id;
}

async function findObjectiveIdByType(type: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::objective.objective', {
    filters: { type },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No objective found with the name "${type}"`);
  }

  return result[0].id;
}

async function findOrganizationTypeIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::organization-type.organization-type', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No organization type found with the name "${name}"`);
  }

  return result[0].id;
}

async function findFundingIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::organization-type.organization-type', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No funding found with the name "${name}"`);
  }

  return result[0].id;
}

async function findWorldCountryIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::world-country.world-country', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No world country found with the name "${name}"`);
  }

  return result[0].id;
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
      const status = row.status ? [await findProjectStatusIdByName(row.status)] : [];
      const sourceCountry = row.source_country ? [await findWorldCountryIdByName(row.source_country)] : [];
      const objective = row.objective ? [await findObjectiveIdByType(row.objective)] : [];
      const organizationType = row.organization_type ? [await findOrganizationTypeIdByName(row.organization_type)] : []
      const funding = row.funding ? [await findFundingIdByName(row.funding)]: [];

      const countryIds = await Promise.all(countryNames.map(name => findCountryIdByName(name)));
      const sdgIds = await Promise.all(sdgNames.map(name => findSdgIdByName(name)));
      const pillarIds = await Promise.all(pillarNames.map(name => findPillarIdByName(name)));
      const publishedAt = new Date().toISOString();

      const updatedRow: any = {
        ...row,
        countries: countryIds,
        sdgs: sdgIds,
        pillar: pillarIds,
        status,
        source_country: sourceCountry,
        objective,
        organization_type: organizationType,
        funding,
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
