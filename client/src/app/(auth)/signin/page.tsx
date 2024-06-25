import { Metadata } from "next";

import Signin from "@/components/forms/signin";

export const metadata: Metadata = {
  title: "Sign in | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default function SigninPage() {
  return (
    <>
      <h1 className="py-10 text-3xl font-bold -tracking-[0.0375rem]">Log in</h1>
      <Signin />
    </>
  );
}