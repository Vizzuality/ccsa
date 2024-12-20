import { UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  },
});

export const updateOrCreateOtherTools = async (
  data: unknown,
  userToken: string,
  options?: UseQueryOptions<unknown>,
) => {
  try {
    const response = await api.request({
      method: "post",
      url: "/other-tools/approve-other-tool-suggestion",
      data: {
        data,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      ...options,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update/create other tool");
  }
};

export function uploadOtherToolsCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("file", data[0]);

  return api
    .request({
      method: "post",
      url: "/other-tools/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then((response) => {
      console.info("Tools uploaded successfully:", response.data);
      toast.success("Tools uploaded successfully");
      return response;
    })
    .catch((err) => {
      toast.error(err.response.data.error.message);
      return err;
    });
}

export function uploadToolEditSuggestionCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("file", data[0]);

  return api
    .request({
      method: "post",
      url: "/tool-edit-suggestions/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then((response) => {
      console.info("Tools suggestions uploaded successfully:", response.data);
      toast.success("Tools suggestions uploaded successfully");
      return response;
    })
    .catch((err) => {
      toast.error(err.response.data.error.message);
      return err;
    });
}
