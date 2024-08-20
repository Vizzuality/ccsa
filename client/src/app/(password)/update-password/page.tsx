import { Metadata } from "next";

import PasswordUpdate from "@/components/forms/password-update";

export const metadata: Metadata = {
  title: "Reset Password | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default function UpdatePasswordPage() {
  return (
    <>
      <div className="space-y-2 py-10">
        <h1 className="pt-10 text-3xl font-bold -tracking-[0.0375rem]">Reset your password</h1>
      </div>
      <PasswordUpdate />
    </>
  );
}