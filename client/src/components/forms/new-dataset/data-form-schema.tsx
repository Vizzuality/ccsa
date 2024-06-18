import { z } from "zod";

import type { VALUE_TYPE } from "./types";

export const getFormSchema = (valueType: VALUE_TYPE, countries: string[]) => {
  console.log(valueType, countries);
  if (valueType === "number") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}-number`] = z.coerce.number();
          return acc;
        },
        {} as Record<string, z.ZodNumber>,
      ),
    );
  } else if (valueType === "resource") {
    return z.object(
      countries.reduce((acc, country) => {
        acc[`${country}-title`] = z.string().min(1, { message: "Please enter a title" });
        acc[`${country}-link`] = z.string().url({ message: "Please enter a valid URL" });
        acc[`${country}-description`] = z
          .string()
          .min(1, { message: "Please enter a description" });
        return acc;
      }, {} as z.ZodRawShape),
    );
  } else if (valueType === "text") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}-text`] = z.string().min(1, { message: "Please enter a valid text" });
          return acc;
        },
        {} as Record<string, z.ZodString>,
      ),
    );
  } else if (valueType === "boolean") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}-boolean`] = z
            .string()
            .optional()
            .transform((value) => value === "on");
          return acc;
        },
        {} as Record<string, z.ZodEffects<z.ZodOptional<z.ZodString>, boolean>>,
      ),
    );
  } else {
    throw new Error("Invalid valueType");
  }
};
