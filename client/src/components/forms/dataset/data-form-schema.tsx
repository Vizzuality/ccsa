import { z } from "zod";

import type { VALUE_TYPE } from "./types";
import { URL_REGEX } from "@/lib/utils/url-validator";

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
              link_title: z.string().min(1, { message: "title" }),
              link_url: z
                .string()
                .regex(new RegExp(URL_REGEX), {
                  message: "URL",
                })
                .max(255, {
                  message: "Website is limited to 255 characters.",
                }),
              description: z.string().min(1, { message: "description" }),
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
