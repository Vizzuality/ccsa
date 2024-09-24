import { Metadata } from "next";

import ResetPassword from "@/components/forms/reset-password";

export const metadata: Metadata = {
  title: "Reset Password | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="space-y-2 py-10">
        <h1 className="pt-10 text-3xl font-bold -tracking-[0.0375rem]">Reset your password</h1>
        <p className="max-w-[310px] text-center text-xs font-light">
          Enter your email address or username, and we&apos;ll send you a link to get back into your
          account.
        </p>
      </div>
      <ResetPassword />
    </>
  );
}
