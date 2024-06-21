"use client";

import { useRef, useState } from "react";

import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";

import { LuPlay } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function WelcomeMessage() {
  const videoRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [cookies, setCookie] = useCookies(["welcome"]);

  const handleExplore = () => {
    setCookie("welcome", true);
  };

  const handlePlay = () => {
    setPlaying((prev) => !prev);
  };

  return (
    <Dialog open={!cookies.welcome}>
      <DialogContent close={false} className="max-w-[500px] 2xl:max-w-[600px]">
        <div className="w-full divide-y divide-gray-200 overflow-hidden">
          <div className="flex w-full flex-col items-center justify-center space-y-5 p-12 text-center">
            <header className="max-w-md space-y-5">
              <h1 className="inline-block bg-gradient-to-r from-[#88DA85] to-[#39C7E0] bg-clip-text font-metropolis text-3xl font-bold uppercase tracking-tight text-transparent">
                Welcome to Caribbean climate smart map
              </h1>
              <p className="text-base font-light text-muted-foreground 2xl:text-xl">
                Welcome to the Climate Smart Map! Explore real-time data and find collaborative
                opportunities for Caribbean climate action projects.
              </p>
            </header>

            <Button size="lg" onClick={handleExplore}>
              Explore map
            </Button>
          </div>
          <div className="w-full overflow-hidden">
            <div className="relative aspect-video">
              {!playing && (
                <button
                  className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={handlePlay}
                >
                  <LuPlay className="h-5 w-5 translate-x-0.5 fill-white stroke-white" />
                </button>
              )}

              <ReactPlayer
                ref={videoRef}
                className="h-full w-full object-cover"
                playing={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                controls
                url="https://map.caribbeanaccelerator.org/cms/uploads/SID_4_Pre_Event_MAP_Video_f2c11c04ec.mp4"
                width={"100%"}
                height={"100%"}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
