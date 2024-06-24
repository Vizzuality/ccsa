"use client";

import dynamic from "next/dynamic";

export default function DashboardContent() {
  const role = "admin";

  const DynamicContent = dynamic(() => import(`@/containers/dashboard/${role}`));

  return (
    <div>
      <DynamicContent />
    </div>
  );
}
