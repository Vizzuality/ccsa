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
  DatasetListResponse,
  DatasetRequest,
  DatasetResponse,
  Error,
  GetDatasetsIdParams,
  GetDatasetsParams,
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

export const getDatasets = (
  params?: GetDatasetsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetListResponse>({ url: `/datasets`, method: "get", params, signal }, options);
};

export const getGetDatasetsQueryKey = (params?: GetDatasetsParams) => {
  return [`/datasets`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetsQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasets>>> = ({ signal }) =>
    getDatasets(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasets>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetsQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasets>>>;
export type GetDatasetsQueryError = ErrorType<Error>;

export const useGetDatasets = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postDatasets = (
  datasetRequest: DatasetRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetResponse>(
    {
      url: `/datasets`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: datasetRequest,
    },
    options,
  );
};

export const getPostDatasetsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasets>>,
    TError,
    { data: DatasetRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postDatasets>>,
  TError,
  { data: DatasetRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postDatasets>>,
    { data: DatasetRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postDatasets(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostDatasetsMutationResult = NonNullable<Awaited<ReturnType<typeof postDatasets>>>;
export type PostDatasetsMutationBody = DatasetRequest;
export type PostDatasetsMutationError = ErrorType<Error>;

export const usePostDatasets = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasets>>,
    TError,
    { data: DatasetRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostDatasetsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getDatasetsId = (
  id: number,
  params?: GetDatasetsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetResponse>({ url: `/datasets/${id}`, method: "get", params, signal }, options);
};

export const getGetDatasetsIdQueryKey = (id: number, params?: GetDatasetsIdParams) => {
  return [`/datasets/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetsId>>> = ({ signal }) =>
    getDatasetsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasetsId>>>;
export type GetDatasetsIdQueryError = ErrorType<Error>;

export const useGetDatasetsId = <
  TData = Awaited<ReturnType<typeof getDatasetsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putDatasetsId = (
  id: number,
  datasetRequest: DatasetRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetResponse>(
    {
      url: `/datasets/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: datasetRequest,
    },
    options,
  );
};

export const getPutDatasetsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetsId>>,
    TError,
    { id: number; data: DatasetRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putDatasetsId>>,
  TError,
  { id: number; data: DatasetRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putDatasetsId>>,
    { id: number; data: DatasetRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putDatasetsId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutDatasetsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putDatasetsId>>>;
export type PutDatasetsIdMutationBody = DatasetRequest;
export type PutDatasetsIdMutationError = ErrorType<Error>;

export const usePutDatasetsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetsId>>,
    TError,
    { id: number; data: DatasetRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutDatasetsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteDatasetsId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/datasets/${id}`, method: "delete" }, options);
};

export const getDeleteDatasetsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteDatasetsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteDatasetsId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteDatasetsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteDatasetsId>>
>;

export type DeleteDatasetsIdMutationError = ErrorType<Error>;

export const useDeleteDatasetsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteDatasetsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
