import { Metadata } from "next";

import ToolForm from "@/containers/other-tools/form";

export const metadata: Metadata = {
  title: "Create / edit a tool | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default function OtherToolsFormPage() {
  return (
    <div className="relative z-10 h-full w-full bg-white">
      <ToolForm />
    </div>
  );
}
