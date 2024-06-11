import { Metadata } from "next";

import NewDatasetForm from "@/containers/datasets/new-dataset";

export const metadata: Metadata = {
  title: "New dataset form | Caribbean Climate smart map",
  description: "Generated by create next app",
};

export default function NewDatasetPagePage() {
  return (
    <>
      <p className="text-xs font-light">
        Fill the dataset&apos;s settings before continuing to add the dataset.
      </p>
      <NewDatasetForm />
    </>
  );
}
