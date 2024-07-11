import { UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

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
  return await api
    .request({
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
    })
    .then(({ data }) => data)
    .catch((err) => {
      return err;
    });
};
