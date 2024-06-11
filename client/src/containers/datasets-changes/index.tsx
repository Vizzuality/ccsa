"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  usePostAuthForgotPassword,
  usePostAuthChangePassword,
} from "@/types/generated/users-permissions-auth";

export default function PersonalDataForm() {
  const { replace } = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const { mutate } = usePostAuthForgotPassword({
    mutation: {
      onSuccess: (data) => {
        console.log("Success creating dataset:", data);
        const searchParams = new URLSearchParams();
        replace(`/signin?${searchParams.toString()}`);
      },
      onError: (error) => {
        console.error("Error creating dataset:", error);
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    const fieldsToUpdate = form.formState.dirtyFields;
    mutate({ data: { email: values.email } });
  }

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
