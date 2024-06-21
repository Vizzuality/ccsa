"use client";

import { useEffect, useRef, useState } from "react";

import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";

import Image from "next/image";

import { LuPlay } from "react-icons/lu";
import screenfull from "screenfull";

import { cn } from "@/lib/classnames";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function WelcomeMessage() {
  const videoRef = useRef<ReactPlayer>(null);
  const videoRefContainer = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [cookies, setCookie] = useCookies(["welcome"]);

  const handleExplore = () => {
    setCookie("welcome", true);
  };

  const handlePlay = () => {
    if (!videoRefContainer.current) return;
    setPlaying((prev) => !prev);
    screenfull.request(videoRefContainer.current);
  };

  const handleFullscreen = () => {
    setFullscreen(screenfull.isFullscreen);
  };

  useEffect(() => {
    screenfull.on("change", handleFullscreen);

    return () => {
      screenfull.off("change", handleFullscreen);
    };
  }, []);

  return (
    <Dialog open={!cookies.welcome}>
      <DialogContent close={false} className="overflow-hidden border-none lg:max-w-[900px]">
        <div className="flex w-full flex-col overflow-hidden lg:flex-row">
          <div className="flex w-full flex-col items-center justify-center space-y-5 p-5 text-center lg:w-1/2 lg:space-y-10 lg:p-12">
            <header className="max-w-md space-y-2 lg:space-y-5">
              <h1 className="inline-block bg-gradient-to-r from-[#88DA85] to-[#39C7E0] bg-clip-text font-metropolis text-xl font-bold uppercase tracking-tight text-transparent lg:text-3xl">
                Welcome to Caribbean climate smart map
              </h1>
              <p className="text-base font-light text-gray-400 2xl:text-xl">
                Welcome to the Climate Smart Map! Explore real-time data and find collaborative
                opportunities for Caribbean climate action projects.
              </p>
            </header>

            <Button size="lg" onClick={handleExplore}>
              Explore map
            </Button>
          </div>
          <div className="w-full overflow-hidden lg:w-1/2">
            <div className="relative aspect-video lg:aspect-square">
              {!playing && (
                <button
                  className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={handlePlay}
                >
                  <LuPlay className="h-5 w-5 translate-x-0.5 fill-white stroke-white" />
                </button>
              )}

              <Image
                src="/images/welcome-message.jpeg"
                alt="Welcome message"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div
              ref={videoRefContainer}
              className={cn({ "relative aspect-video": true, hidden: !fullscreen })}
            >
              <ReactPlayer
                ref={videoRef}
                className={cn({ "h-full w-full object-cover": true })}
                playing={playing && fullscreen}
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
