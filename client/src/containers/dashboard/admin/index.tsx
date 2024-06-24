"use client";

import DatasetPendingChangesAdmin from "@/containers/datasets/pending-changes-admin";
import PersonalData from "@/containers/personal-data";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardContentAdmin() {
  return (
    <Tabs defaultValue="changes" className="w-full divide-y-2 divide-gray-300/20">
      <TabsList className="p-4 sm:px-10 md:px-24 lg:px-32">
        <TabsTrigger value="changes">Pending to approve</TabsTrigger>
        <TabsTrigger value="account">Personal data</TabsTrigger>
      </TabsList>
      <TabsContent value="changes">
        <DatasetPendingChangesAdmin />
      </TabsContent>
      <TabsContent value="account">
        <PersonalData />
      </TabsContent>
    </Tabs>
  );
}
