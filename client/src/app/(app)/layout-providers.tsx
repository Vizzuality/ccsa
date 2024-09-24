"use client";

import { PropsWithChildren } from "react";

import { CookiesProvider } from "react-cookie";
import { MapProvider } from "react-map-gl";

import { Provider as JotaiProvider } from "jotai";

export default function LayoutProviders({ children }: PropsWithChildren) {
  return (
    <CookiesProvider
      defaultSetOptions={{
        path: "/",
      }}
    >
      <JotaiProvider>
        <MapProvider>{children}</MapProvider>
      </JotaiProvider>
    </CookiesProvider>
  );
}
