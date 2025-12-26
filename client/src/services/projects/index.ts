import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

import type {
  Country,
  Error,
  Pillar,
  ProjectListResponse,
  ProjectStatus,
} from "@/types/generated/strapi.schemas";
import { API } from "../../services/api/index";
import type { ErrorType } from "../../services/api/index";

type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

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
    .then((response) => {
      console.info("Projects uploaded successfully:", response.data);
      toast.success("Projects uploaded successfully");
      return response;
    })
    .catch((err) => {
      toast.error(err.response.data.error.message);
      return err;
    });
}

export function uploadProjectsSuggestionCsv(
  data: File[],
  headers: { [key: string]: string },
  options?: UseQueryOptions<unknown>,
) {
  const formData = new FormData();
  formData.append("file", data[0]);

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
    .then((response) => {
      console.info("Projects suggestions uploaded successfully:", response.data);
      toast.success("Projects suggestions uploaded successfully");
      return response;
    })
    .catch((err) => {
      toast.error(err.response.data.error.message);
      return err;
    });
}

export const searchByName = async (params: {
  q?: string;
  pillars?: Pillar[];
  countries?: Country[] | null;
  status?: ProjectStatus[] | null;
  sortField?: "name" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) => {
  const res = await api.request({
    method: "get",
    url: "/projects/search-by-name",
    params: {
      q: params.q ?? "",
      pillars: params.pillars?.join(","),
      countries: params.countries?.filter(Boolean).join(","),
      status: params.status?.join(","),
      sortField: params.sortField ?? "name",
      sortOrder: params.sortOrder ?? "asc",
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 200,
    },
  });
  return res.data;
};

export type SearchProjectsWholeWordParams = {
  q?: string;
  page?: number;
  pageSize?: number;

  pillars?: number[];
  countries?: string[];
  status?: number[];

  sortField?: "name" | "status";
  sortOrder?: "asc" | "desc";
};

export const searchProjectsWholeWord = (
  params?: SearchProjectsWholeWordParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<ProjectListResponse>(
    { url: `/projects/search-by-name`, method: "get", params, signal },
    options,
  );
};

export const getSearchProjectsWholeWordQueryKey = (params?: SearchProjectsWholeWordParams) => {
  return [`/projects/search-by-name`, ...(params ? [params] : [])] as const;
};

export const getSearchProjectsWholeWordQueryOptions = <
  TData = Awaited<ReturnType<typeof searchProjectsWholeWord>>,
  TError = ErrorType<Error>,
>(
  params?: SearchProjectsWholeWordParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchProjectsWholeWord>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getSearchProjectsWholeWordQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof searchProjectsWholeWord>>> = ({
    signal,
  }) => searchProjectsWholeWord(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof searchProjectsWholeWord>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type SearchProjectsWholeWordQueryResult = NonNullable<
  Awaited<ReturnType<typeof searchProjectsWholeWord>>
>;
export type SearchProjectsWholeWordQueryError = ErrorType<Error>;

export const useGetProjectsWholeWordSearch = <
  TData = Awaited<ReturnType<typeof searchProjectsWholeWord>>,
  TError = ErrorType<Error>,
>(
  params?: SearchProjectsWholeWordParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchProjectsWholeWord>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getSearchProjectsWholeWordQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
