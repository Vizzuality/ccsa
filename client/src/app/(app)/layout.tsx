import { PropsWithChildren } from "react";

import Map from "@/containers/map";
import Navigation from "@/containers/navigation";
import Sidebar from "@/containers/sidebar";

import LayoutProviders from "./layout-providers";

export default async function AppLayout({ children }: PropsWithChildren) {
  return (
    <LayoutProviders>
      <main className="flex h-[100svh] w-full justify-between">
        <Navigation />
        <Sidebar>{children}</Sidebar>
        <Map />
      </main>
    </LayoutProviders>
  );
}
