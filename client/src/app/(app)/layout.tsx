import { PropsWithChildren } from "react";

import MapSettingsManagerPanel from "@/containers/map-settings";
import MapSettingsManager from "@/containers/map-settings/manager";
import Navigation from "@/containers/navigation";
import Sidebar from "@/containers/sidebar";

import Map from "@/components/map";
import Controls from "@/components/map/controls";
import SettingsControl from "@/components/map/controls/settings";
import ZoomControl from "@/components/map/controls/zoom";

import LayoutProviders from "./layout-providers";

export default async function AppLayout({ children }: PropsWithChildren) {
  return (
    <LayoutProviders>
      <main className="flex h-[100svh] w-full justify-between">
        <Navigation />
        <Sidebar>{children}</Sidebar>
        <Map>
          <Controls className="absolute right-6 top-4">
            <ZoomControl />
            <SettingsControl>
              <MapSettingsManagerPanel />
            </SettingsControl>
          </Controls>
          <MapSettingsManager />
        </Map>
      </main>
    </LayoutProviders>
  );
}
