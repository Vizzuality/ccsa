import { UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  },
});
export const updateOrCreateProject = async (
  data: unknown,
  userToken: string,
  options?: UseQueryOptions<unknown>,
) => {
  try {
    const response = await api.request({
      method: "post",
      url: "/projects/approve-project-suggestion",
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
    throw new Error("Failed to update/create project");
  }
};

export function uploadProjectsCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("file", data[0]);

  return api
    .request({
      method: "post",
      url: "/projects/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then(({ data }) => data)
    .catch((err) => {
      return err;
    });
}

export function uploadProjectsSuggestionCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("csv", data[0]);

  return api
    .request({
      method: "post",
      url: "/project-edit-suggestions/import",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then(({ data }) => data)
    .catch((err) => {
      return err;
    });
}
