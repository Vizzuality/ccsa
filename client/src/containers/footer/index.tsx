"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

const Footer = (): JSX.Element => {
  const pathname = usePathname();
  return (
    <div className="relative z-20 flex h-24 w-full justify-center bg-white p-4">
      <Link className="flex flex-col items-center justify-center gap-1" href="/">
        {pathname === "/signin" ? (
          <p className="text-center text-sm">
            <span className="font-light">{"Don't"} have an account? </span>
            <Link className="font-semibold text-primary underline " href="/signup">
              Register
            </Link>{" "}
          </p>
        ) : (
          <div className="text-center text-sm">
            <span className="font-light">Already have an account? </span>
            <Link className="font-semibold text-primary underline" href="/signin">
              Log in
            </Link>{" "}
          </div>
        )}
      </Link>
    </div>
  );
};

export default Footer;
