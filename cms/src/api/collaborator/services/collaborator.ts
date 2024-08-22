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
    const records: any[] = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Process each row
    const updatedRecords = records.map((row: any) => {
      const publishedAt = new Date().toISOString();

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
