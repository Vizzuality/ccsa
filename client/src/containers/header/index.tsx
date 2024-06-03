"use client";

import Image from "next/image";
import Link from "next/link";

const Header = (): JSX.Element => (
  <div className="relative z-20 flex h-24 w-full justify-center bg-white p-4">
    <Link className="flex flex-col items-center justify-center gap-1" href="/">
      <Image priority alt="CCSA Logo" width={72} height={59} src="/logo.svg" />
    </Link>
  </div>
);

export default Header;
