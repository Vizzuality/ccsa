/**
 * other-tool service
 */

import { factories } from '@strapi/strapi';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';
import * as stringify from 'csv-stringify/sync';

// Helper function to find ID by name for other_tools_categories
async function findOtherToolCategoryIdByName(name: string): Promise<number> {
  const result: any = await strapi.entityService.findMany('api::other-tools-category.other-tools-category', {
    filters: { name },
    fields: ['id'],
  });

  if (result.length === 0) {
    throw new Error(`No category found with the name "${name}"`);
  }

  return result[0].id;
}

export default factories.createCoreService('api::other-tool.other-tool', {
  async parseAndReplaceIds(file: any, author: number | null = null): Promise<{ csvData: string; rowCount: number }> {
    // Read and parse the CSV file
    const fileContent = fs.readFileSync(file.path, 'utf8');

    const allowedColumns = ['name', 'description', 'link', 'other_tools_category'];

    const records: any[] = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length === 0) {
      throw new Error('CSV file is empty');
    }

    const csvColumns = Object.keys(records[0]);

    // Check for any columns not allowed
    const invalidColumns = csvColumns.filter(col => !allowedColumns.includes(col));
    if (invalidColumns.length > 0) {
      throw new Error(`Invalid columns detected: ${invalidColumns.join(', ')}`);
    }

    // Check for missing columns and throw an error if any are missing
    const missingColumns = allowedColumns.filter(col => !csvColumns.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const updatedRecords = await Promise.all(records.map(async (row: any) => {
      const categoryNames = row.other_tools_category.split(';').map(name => name.trim());

      const categoryIds = await Promise.all(categoryNames.map(name => findOtherToolCategoryIdByName(name)));
      const publishedAt = new Date().toISOString();

      const updatedRow: any = {
        ...row,
        other_tools_category: categoryIds,
        publishedAt,
      };

      // Add author relation if provided
      if (author) {
        updatedRow.author = author;
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
