import {
  OtherToolResponseDataObject,
  ToolEditSuggestionOtherToolDataAttributes,
} from "@/types/generated/strapi.schemas";

import { Data } from "@/components/forms/dataset/types";

type DATA =
  | Data["settings"]
  | Data["data"]
  | Data["colors"]
  | OtherToolResponseDataObject["attributes"]
  | ToolEditSuggestionOtherToolDataAttributes;

export function compareData(obj1: Record<string, string>, obj2: Record<string, string>) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => obj1[key] === obj2[key]);
}

export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export function isObjectEmpty(obj: Record<string, string | number | undefined>) {
  return Object.values(obj).every(
    (value) =>
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value)),
  );
}

// get differences within objects
export function getObjectDifferences(
  obj1: { [key: string]: unknown | DATA },
  obj2: { [key: string]: unknown | DATA },
): string[] {
  if (!obj1 || !obj2) return [];

  const keys = new Set([...getKeys(obj1), ...getKeys(obj2)]);

  const differences: string[] = [];

  keys.forEach((key) => {
    if (obj1[`${key.toString()}`] !== obj2[`${key.toString()}`]) {
      differences.push(`${key.toString()}`);
    }
  });

  return differences.length > 0 ? differences : [];
}
