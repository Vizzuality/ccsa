"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PersonalDataForm() {
  return (
    <div className="space-y-10 p-4 py-10 sm:px-10 md:px-24 lg:px-32">
      <h1 className="text-3xl font-bold -tracking-[0.0375rem]">Pending changes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Change type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Dataset </TableCell>
            <TableCell>Dataset name lorem ipsum dolor sit</TableCell>
            <TableCell>15/03/2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dataset </TableCell>
            <TableCell>Dataset name lorem ipsum dolor sit</TableCell>
            <TableCell>15/03/2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dataset </TableCell>
            <TableCell>Dataset name lorem ipsum dolor sit</TableCell>
            <TableCell>15/03/2024</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
