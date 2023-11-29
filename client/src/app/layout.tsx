import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import PoweredBy from "@/containers/powered-by";

import LayoutProviders from "./layout-providers";

export const metadata: Metadata = {
  title: "CCSA",
  description: "Caribbean Climate smart map",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <LayoutProviders>
      <html lang="en">
        <body>
          {children}

          <div className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2">
            <PoweredBy />
          </div>
        </body>
      </html>
    </LayoutProviders>
  );
}
