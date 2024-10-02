import { Metadata, Viewport } from "next";

import Signup from "@/components/forms/signup";

export const metadata: Metadata = {
  title: "Sign up | Caribbean Climate smart map",
  description: "Caribbean Climate smart map",
};

export const viewport: Viewport = {
  width: 1000,
  initialScale: 1,
};

export default function SignupPage() {
  return (
    <>
      <h1 className="py-10 text-3xl font-bold -tracking-[0.0375rem]">Sign up</h1>
      <Signup />
    </>
  );
}
