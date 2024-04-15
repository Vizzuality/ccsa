import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";

import env from "@/env.mjs";

import PoweredBy from "@/containers/powered-by";

import { metropolis, openSans } from "@/styles/fonts";

import LayoutProviders from "./layout-providers";

export const metadata: Metadata = {
  title: { template: "%s | CCSA", default: "CCSA" },
  description: "Caribbean Climate smart map",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <LayoutProviders>
      <html lang="en" className={`${openSans.variable} ${metropolis.variable}`}>
        <body>
          {children}

          <div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
            <PoweredBy />
          </div>
        </body>

        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_TRACKING_ID} />
      </html>
    </LayoutProviders>
  );
}
