import { z } from "zod";

import type { VALUE_TYPE } from "./types";

export const getFormSchema = (valueType: VALUE_TYPE, countries: string[]) => {
  if (valueType === "number") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.coerce.number().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodNumber>>,
      ),
    );
  } else if (valueType === "resource") {
    return z.object(
      countries.reduce((acc, country) => {
        acc[`${country}`] = z.array(
          z.object({
            title: z.string().min(1, { message: "Please enter a title" }),
            link: z.string().url({ message: "Please enter a valid URL" }),
            description: z.string().min(1, { message: "Please enter a description" }),
          }),
        );
        return acc;
      }, {} as z.ZodRawShape),
    );
  } else if (valueType === "text") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.string().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodString>>,
      ),
    );
  } else if (valueType === "boolean") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.boolean().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodBoolean>>,
      ),
    );
  } else {
    throw new Error("Invalid valueType");
  }
};
