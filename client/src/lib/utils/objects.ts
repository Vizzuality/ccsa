import {
  // OtherToolResponseDataObject,
  // ToolEditSuggestionOtherToolDataAttributes,
  ToolEditSuggestion,
  Project,
  Collaborator,
} from "@/types/generated/strapi.schemas";

// import { Data } from "@/components/forms/dataset/types";

// type DATA =
//   | Data["settings"]
//   | Data["data"]
//   | Data["colors"]
//   | OtherToolResponseDataObject["attributes"]
//   | ToolEditSuggestionOtherToolDataAttributes;

// get differences within objects

// Define a type that can be an object with string keys and unknown values, or custom types, or undefined
type PossibleObject =
  | { [key: string]: unknown }
  | Record<string, unknown>
  | Collaborator
  | ToolEditSuggestion
  | Project
  | undefined;

// Type guard to check if an object has an index signature
function hasIndexSignature(
  obj: PossibleObject,
): obj is { [key: string]: unknown } | Record<string, unknown> {
  return (
    obj !== undefined &&
    typeof obj === "object" &&
    ("[key: string]" in obj || Object.prototype.toString.call(obj) === "[object Object]")
  );
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

  // Ensure both objects have index signatures
  if (!hasIndexSignature(obj1) || !hasIndexSignature(obj2)) {
    throw new Error("One of the objects does not have an index signature");
  }

  // Create a set of keys from both objects
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  // Array to store the differences
  const differences: string[] = [];

  // Iterate over the keys and compare the values in both objects
  keys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      differences.push(key);
    }
  });

  // Return the differences or an empty array if there are none
  return differences.length > 0 ? differences : [];
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
