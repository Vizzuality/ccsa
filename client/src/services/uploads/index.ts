import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  },
});

export function useValidateCsv(
  data: File,
  headers: AxiosHeaders,
  options?: UseQueryOptions<unknown>,
) {
  const validateCSV = () => {
    return api
      .request({
        method: "post",
        url: "/csv/parse-csv",
        data: {
          files: data,
        },
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...options,
      })
      .then(({ data }) => data)
      .catch((err) => {
        return err;
      });
  };

  return useQuery(["validate-csv"], validateCSV);
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
