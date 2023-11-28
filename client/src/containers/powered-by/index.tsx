"use client";

import VizzualitySVG from "@/svgs/vizzuality.svg";

const PoweredBy = (): JSX.Element => {
  return (
    <a
      href="https://vizzuality.com"
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center justify-center gap-1 rounded-t-md bg-gray-800/40 p-2 text-xs text-white hover:text-gray-100"
    >
      <span className="text-xxs">Powered by</span>
      <VizzualitySVG />
    </a>
  );
};

export default PoweredBy;
