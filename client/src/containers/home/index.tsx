"use client";

import Map from "@/components/map";
import Controls from "@/components/map/controls";
import ZoomControl from "@/components/map/controls/zoom";

const Home = (): JSX.Element => {
  return (
    <div className="h-screen w-full">
      <Map>
        <Controls>
          <ZoomControl />
        </Controls>
      </Map>
    </div>
  );
};

export default Home;
