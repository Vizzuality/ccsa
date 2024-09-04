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

export const updateOrCreateDataset = async (
  data: unknown,
  userToken: string,
  options?: UseQueryOptions<unknown>,
) => {
  try {
    const response = await api.request({
      method: "post",
      url: "/datasets/approve-dataset-suggestion",
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
    throw new Error("Failed to update/create dataset");
  }
};
export function validateDatasetValuesCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("csv", data[0]);

  return api
    .request({
      method: "post",
      url: "/csv/parse-csv",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
      ...options,
    })
    .then(({ data }) => {
      console.info("Data uploaded successfully:", data);
      toast.success("Data uploaded successfully:", data);
    })
    .catch((err) => {
      console.error("There was an error uploading the file:", err.message);
      toast.error("There was an error uploading the file:", err.message);
      return err;
    });
}

export function uploadImage(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("files", data[0]);
  return api
    .request({
      method: "post",
      url: "/upload",
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
