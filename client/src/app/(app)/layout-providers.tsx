"use client";

import { PropsWithChildren } from "react";

import { MapProvider } from "react-map-gl";

export default function LayoutProviders({ children }: PropsWithChildren) {
  return <MapProvider>{children}</MapProvider>;
}
