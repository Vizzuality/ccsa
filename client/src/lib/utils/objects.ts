import { ToolEditSuggestion, Project, Collaborator } from "@/types/generated/strapi.schemas";

import { VALUE_TYPE, Data } from "@/components/forms/dataset/types";

type PossibleObject =
  | { [key: string]: unknown }
  | Record<string, unknown>
  | Collaborator
  | ToolEditSuggestion
  | Project
  | undefined;

type AttributeType = "link_title" | "description" | "link_url";

interface ChangeType {
  attr: AttributeType;
  index: number;
}

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

// Function to get the differences between two objects
export function getObjectDifferences(obj1: PossibleObject, obj2: PossibleObject): string[] {
  // If either object is undefined, return an empty array
  if (!obj1 || !obj2) return [];

  // Create a set of keys from both objects
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  // Array to store the differences
  const differences: string[] = [];

  // Iterate over the keys and compare the values in both objects
  keys.forEach((key) => {
    const val1 = obj1[key as keyof PossibleObject];
    const val2 = obj2[key as keyof PossibleObject];

    // Consider 0 and null as equal
    const areValuesEqual =
      val1 === val2 || (val1 === 0 && val2 === null) || (val1 === null && val2 === 0);

    if (!areValuesEqual) {
      differences.push(key);
    }
  });

  // Return the differences or an empty array if there are none
  return differences.length > 0 ? differences : [];
}

export function compareDatasetsDataObjects(
  obj1: Data["data"],
  obj2?: Data["data"],
  type?: VALUE_TYPE,
): { [key: string]: ChangeType[] }[] | string[] {
  if (!obj2) {
    return [];
  }

  const isEqual = (val1: any, val2: any): boolean => {
    if (val1 === val2) return true;
    if ((val1 === 0 && val2 === null) || (val1 === null && val2 === 0)) return true;
    return false;
  };

  if (type === "resource") {
    const changes: { [key: string]: ChangeType[] }[] = [];

    Object.keys(obj1).forEach((key) => {
      const arr1 = obj1[key];
      const arr2 = obj2[key];
      const keyChanges: ChangeType[] = [];

      if (Array.isArray(arr1) && Array.isArray(arr2)) {
        const maxLength = Math.max(arr1.length, arr2.length);

        for (let i = 0; i < maxLength; i++) {
          const item1 = arr1[i] || {};
          const item2 = arr2[i] || {};

          const attributes: AttributeType[] = ["link_title", "description", "link_url"];
          attributes.forEach((attr) => {
            if (!isEqual(item1[attr], item2[attr])) {
              keyChanges.push({ attr, index: i });
            }
          });
        }
      }

      if (keyChanges.length > 0) {
        changes.push({ [key]: keyChanges });
      }
    });

    return changes;
  } else {
    const changes: string[] = [];

    Object.keys(obj1).forEach((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (!isEqual(value1, value2)) {
        changes.push(key);
      }
    });

    return changes;
  }
}

export function isEmpty(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] !== "" && obj[key] !== undefined) {
        return false;
      }
    }
  }
  return true;
}
