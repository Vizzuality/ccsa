import { z } from "zod";

import type { VALUE_TYPE } from "./types";

export const getFormSchema = (value_type: VALUE_TYPE, countries: string[]) => {
  if (value_type === "number") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.coerce.number().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodNumber>>,
      ),
    );
  }

  if (value_type === "resource") {
    return z.object(
      countries.reduce((acc, country) => {
        acc[`${country}`] = z
          .array(
            z.object({
              link_title: z.string().min(1, { message: "Please enter a title" }),
              link_url: z
                .string()
                .regex(
                  new RegExp(
                    "^(?=(https?://|www.))((https?://)?(www.)?)[a-zA-Z0-9.-]+.[a-zA-Z]{2,}(/[^s]*)?$",
                  ),
                  {
                    message: "Please, enter a valid URL.",
                  },
                )
                .max(255, {
                  message: "Website is limited to 255 characters.",
                }),
              description: z.string().min(1, { message: "Please enter a description" }),
            }),
          )
          .optional();
        return acc;
      }, {} as z.ZodRawShape),
    );
  }

  if (value_type === "text") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.string().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodString>>,
      ),
    );
  }

  if (value_type === "boolean") {
    return z.object(
      countries.reduce(
        (acc, country) => {
          acc[`${country}`] = z.boolean().optional();
          return acc;
        },
        {} as Record<string, z.ZodOptional<z.ZodBoolean>>,
      ),
    );
  }

  return z.object({});
};
