"use client";

import MapSettingsManagerPanel from "@/containers/home/map-settings";
import MapSettingsManager from "@/containers/home/map-settings/manager";

import Map from "@/components/map";
import Controls from "@/components/map/controls";
import SettingsControl from "@/components/map/controls/settings";
import ZoomControl from "@/components/map/controls/zoom";

const Home = (): JSX.Element => {
  return (
    <div className="h-screen w-full">
      <Map>
        <Controls className="absolute right-6 top-4">
          <ZoomControl />
          <SettingsControl>
            <MapSettingsManagerPanel />
          </SettingsControl>
        </Controls>
        <MapSettingsManager />
      </Map>
    </div>
  );
};

export default Home;
