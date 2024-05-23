import { Metadata } from "next";

import Signup from "@/components/forms/signup";

export const metadata: Metadata = {
  title: "Sign up | Caribbean Climate smart map",
  description: "Caribbean Climate smart map",
};

export default function SignupPage() {
  return (
    <section className="flex grow flex-col items-center justify-center space-y-5 py-24">
      <Signup />
    </section>
  );
}
