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
  DatasetValueListResponse,
  DatasetValueRequest,
  DatasetValueResponse,
  Error,
  GetDatasetValuesIdParams,
  GetDatasetValuesParams,
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

export const getDatasetValues = (
  params?: GetDatasetValuesParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetValueListResponse>(
    { url: `/dataset-values`, method: "get", params, signal },
    options,
  );
};

export const getGetDatasetValuesQueryKey = (params?: GetDatasetValuesParams) => {
  return [`/dataset-values`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetValuesQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetValues>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetValuesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetValues>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetValuesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetValues>>> = ({ signal }) =>
    getDatasetValues(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetValues>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetValuesQueryResult = NonNullable<Awaited<ReturnType<typeof getDatasetValues>>>;
export type GetDatasetValuesQueryError = ErrorType<Error>;

export const useGetDatasetValues = <
  TData = Awaited<ReturnType<typeof getDatasetValues>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetValuesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetValues>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetValuesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postDatasetValues = (
  datasetValueRequest: DatasetValueRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetValueResponse>(
    {
      url: `/dataset-values`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: datasetValueRequest,
    },
    options,
  );
};

export const getPostDatasetValuesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasetValues>>,
    TError,
    { data: DatasetValueRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postDatasetValues>>,
  TError,
  { data: DatasetValueRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postDatasetValues>>,
    { data: DatasetValueRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postDatasetValues(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostDatasetValuesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postDatasetValues>>
>;
export type PostDatasetValuesMutationBody = DatasetValueRequest;
export type PostDatasetValuesMutationError = ErrorType<Error>;

export const usePostDatasetValues = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasetValues>>,
    TError,
    { data: DatasetValueRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostDatasetValuesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getDatasetValuesId = (
  id: number,
  params?: GetDatasetValuesIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetValueResponse>(
    { url: `/dataset-values/${id}`, method: "get", params, signal },
    options,
  );
};

export const getGetDatasetValuesIdQueryKey = (id: number, params?: GetDatasetValuesIdParams) => {
  return [`/dataset-values/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetValuesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetValuesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetValuesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetValuesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetValuesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetValuesId>>> = ({ signal }) =>
    getDatasetValuesId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetValuesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetValuesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDatasetValuesId>>
>;
export type GetDatasetValuesIdQueryError = ErrorType<Error>;

export const useGetDatasetValuesId = <
  TData = Awaited<ReturnType<typeof getDatasetValuesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetValuesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetValuesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetValuesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putDatasetValuesId = (
  id: number,
  datasetValueRequest: DatasetValueRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetValueResponse>(
    {
      url: `/dataset-values/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: datasetValueRequest,
    },
    options,
  );
};

export const getPutDatasetValuesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetValuesId>>,
    TError,
    { id: number; data: DatasetValueRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putDatasetValuesId>>,
  TError,
  { id: number; data: DatasetValueRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putDatasetValuesId>>,
    { id: number; data: DatasetValueRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putDatasetValuesId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutDatasetValuesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putDatasetValuesId>>
>;
export type PutDatasetValuesIdMutationBody = DatasetValueRequest;
export type PutDatasetValuesIdMutationError = ErrorType<Error>;

export const usePutDatasetValuesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetValuesId>>,
    TError,
    { id: number; data: DatasetValueRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutDatasetValuesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteDatasetValuesId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/dataset-values/${id}`, method: "delete" }, options);
};

export const getDeleteDatasetValuesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetValuesId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteDatasetValuesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteDatasetValuesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteDatasetValuesId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteDatasetValuesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteDatasetValuesId>>
>;

export type DeleteDatasetValuesIdMutationError = ErrorType<Error>;

export const useDeleteDatasetValuesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetValuesId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteDatasetValuesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
