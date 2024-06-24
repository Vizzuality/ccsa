/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  Error,
  GetProjectsIdParams,
  GetProjectsParams,
  ProjectListResponse,
  ProjectRequest,
  ProjectResponse,
} from "./strapi.schemas";
import { API } from "../../services/api/index";
import type { ErrorType } from "../../services/api/index";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

export const getProjects = (
  params?: GetProjectsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<ProjectListResponse>({ url: `/projects`, method: "get", params, signal }, options);
};

export const getGetProjectsQueryKey = (params?: GetProjectsParams) => {
  return [`/projects`, ...(params ? [params] : [])] as const;
};

export const getGetProjectsQueryOptions = <
  TData = Awaited<ReturnType<typeof getProjects>>,
  TError = ErrorType<Error>,
>(
  params?: GetProjectsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjects>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetProjectsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProjects>>> = ({ signal }) =>
    getProjects(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProjects>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProjectsQueryResult = NonNullable<Awaited<ReturnType<typeof getProjects>>>;
export type GetProjectsQueryError = ErrorType<Error>;

export const useGetProjects = <
  TData = Awaited<ReturnType<typeof getProjects>>,
  TError = ErrorType<Error>,
>(
  params?: GetProjectsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjects>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetProjectsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postProjects = (
  projectRequest: ProjectRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<ProjectResponse>(
    {
      url: `/projects`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: projectRequest,
    },
    options,
  );
};

export const getPostProjectsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProjects>>,
    TError,
    { data: ProjectRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postProjects>>,
  TError,
  { data: ProjectRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postProjects>>,
    { data: ProjectRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postProjects(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostProjectsMutationResult = NonNullable<Awaited<ReturnType<typeof postProjects>>>;
export type PostProjectsMutationBody = ProjectRequest;
export type PostProjectsMutationError = ErrorType<Error>;

export const usePostProjects = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProjects>>,
    TError,
    { data: ProjectRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostProjectsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getProjectsId = (
  id: number,
  params?: GetProjectsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<ProjectResponse>({ url: `/projects/${id}`, method: "get", params, signal }, options);
};

export const getGetProjectsIdQueryKey = (id: number, params?: GetProjectsIdParams) => {
  return [`/projects/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetProjectsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getProjectsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetProjectsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetProjectsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProjectsId>>> = ({ signal }) =>
    getProjectsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProjectsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProjectsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getProjectsId>>>;
export type GetProjectsIdQueryError = ErrorType<Error>;

export const useGetProjectsId = <
  TData = Awaited<ReturnType<typeof getProjectsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetProjectsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetProjectsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putProjectsId = (
  id: number,
  projectRequest: ProjectRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<ProjectResponse>(
    {
      url: `/projects/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: projectRequest,
    },
    options,
  );
};

export const getPutProjectsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putProjectsId>>,
    TError,
    { id: number; data: ProjectRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putProjectsId>>,
  TError,
  { id: number; data: ProjectRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putProjectsId>>,
    { id: number; data: ProjectRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putProjectsId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutProjectsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putProjectsId>>>;
export type PutProjectsIdMutationBody = ProjectRequest;
export type PutProjectsIdMutationError = ErrorType<Error>;

export const usePutProjectsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putProjectsId>>,
    TError,
    { id: number; data: ProjectRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutProjectsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteProjectsId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/projects/${id}`, method: "delete" }, options);
};

export const getDeleteProjectsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteProjectsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteProjectsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteProjectsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteProjectsId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteProjectsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteProjectsId>>
>;

export type DeleteProjectsIdMutationError = ErrorType<Error>;

export const useDeleteProjectsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteProjectsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteProjectsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
