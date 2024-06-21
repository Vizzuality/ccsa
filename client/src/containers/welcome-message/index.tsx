"use client";

import { useCookies } from "react-cookie";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function WelcomeMessage() {
  const [cookies, setCookie] = useCookies(["welcome"]);

  const handleExplore = () => {
    setCookie("welcome", true);
  };

  return (
    <Dialog open={!cookies.welcome}>
      <DialogContent close={false} className="max-w-[500px] 2xl:max-w-[600px]">
        <div className="w-full">
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
          <div className="w-full">
            <div className="aspect-video">
              <video
                className="h-full w-full object-cover"
                src="https://map.caribbeanaccelerator.org/cms/uploads/SID_4_Pre_Event_MAP_Video_f2c11c04ec.mp4"
                controls
              ></video>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
