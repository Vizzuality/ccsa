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
export const updateOrCreateCollaborator = async (
  data: unknown,
  userToken: string,
  options?: UseQueryOptions<unknown>,
) => {
  try {
    const response = await api.request({
      method: "post",
      url: "/collaborators/approve-collaborator-suggestion",
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
    throw new Error("Failed to update/create collaborator");
  }
};

export function uploadCollaboratorsCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("file", data[0]);

  return api
    .request({
      method: "post",
      url: "/collaborators/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then(({ data }) => {
      console.info("Collaborators uploaded successfully:", data);
      toast.success("Collaborators uploaded successfully");
    })
    .catch((err) => {
      toast.error(err.message);
      return err;
    });
}

export function uploadCollaboratorEditSuggestionsCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("csv", data[0]);

  return api
    .request({
      method: "post",
      url: "/collaborator-edit-suggestions/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then(({ data }) => {
      console.info("Collaborators suggestions uploaded successfully:", data);
      toast.success("Collaborators suggestions uploaded successfully");
    })
    .catch((err) => {
      toast.error(err.message);
      return err;
    });
}
