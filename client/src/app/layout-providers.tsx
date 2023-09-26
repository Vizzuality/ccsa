"use client";

import { PropsWithChildren, useState } from "react";

import { MapProvider } from "react-map-gl";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function LayoutProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </MapProvider>
    </QueryClientProvider>
  );
}
