// @ts-check
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {},
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_CMS_URL: z.string().url(),
    NEXT_PUBLIC_CMS_ROOT_URL: z.string().url(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string(),
    NEXT_PUBLIC_MAPBOX_API_TOKEN: z.string(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL,
    NEXT_PUBLIC_CMS_ROOT_URL: process.env.NEXT_PUBLIC_CMS_ROOT_URL,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_MAPBOX_API_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
  },
});

export default env;
