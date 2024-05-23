import Axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getServerSession } from "next-auth/next";
import { getSession, signOut } from "next-auth/react";

import env from "@/env.mjs";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const AXIOS_INSTANCE = Axios.create({ baseURL: env.NEXT_PUBLIC_API_URL });

export const API = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then((response) => response.data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

AXIOS_INSTANCE.interceptors.request.use(async (request) => {
  if (request.url?.includes("/auth/")) {
    return request;
  }

  const session =
    typeof window === "undefined" ? await getServerSession(authOptions) : await getSession();

  if (session) {
    const Authorization = `Bearer ${session.apiToken}`;

    request.headers.Authorization = Authorization;
  } else {
    delete request.headers.Authorization;
  }

  return request;
});

export const AXIOS_SIGNOUT = async () => {
  await signOut();
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export default API;
