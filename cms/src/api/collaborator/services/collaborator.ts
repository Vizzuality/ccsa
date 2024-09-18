/**
 * collaborator service
 */

import { factories } from '@strapi/strapi';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';
import * as stringify from 'csv-stringify/sync';

export default factories.createCoreService('api::collaborator.collaborator', {
  async parseAndPrepareCSV(file: any, author: number | null = null): Promise<{ csvData: string; rowCount: number }> {
    // Read and parse the CSV file
    const fileContent = fs.readFileSync(file.path, 'utf8');

    const allowedColumns = ['name', 'link', 'type'];
    const allowedTypes = ['donor', 'collaborator'];

    const records: any[] = csv.parse(fileContent, {
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
    const updatedRecords = records.map((row: any, index: number) => {
      const publishedAt = new Date().toISOString();

      if (!allowedTypes.includes(row.type)) {
        throw new Error(`Invalid type "${row.type}" in row ${index + 2}. Allowed values are "donor" or "collaborator".`);
      }

      const updatedRow: any = {
        ...row,
        publishedAt,
      };

      // Add author relation if provided
      if (author) {
        updatedRow.author = author;
      }

      return updatedRow;
    });

    const updatedCSV = stringify.stringify(updatedRecords, { header: true });

    return {
      csvData: updatedCSV,
      rowCount: updatedRecords.length,
    };
  },
});
