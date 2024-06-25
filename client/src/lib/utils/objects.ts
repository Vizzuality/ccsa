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
