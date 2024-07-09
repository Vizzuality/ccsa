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
  DatasetEditSuggestionListResponse,
  DatasetEditSuggestionRequest,
  DatasetEditSuggestionResponse,
  Error,
  GetDatasetEditSuggestionsIdParams,
  GetDatasetEditSuggestionsParams,
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

export const getDatasetEditSuggestions = (
  params?: GetDatasetEditSuggestionsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetEditSuggestionListResponse>(
    { url: `/dataset-edit-suggestions`, method: "get", params, signal },
    options,
  );
};

export const getGetDatasetEditSuggestionsQueryKey = (params?: GetDatasetEditSuggestionsParams) => {
  return [`/dataset-edit-suggestions`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetEditSuggestionsQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetEditSuggestions>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetEditSuggestionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetEditSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetEditSuggestionsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetEditSuggestions>>> = ({
    signal,
  }) => getDatasetEditSuggestions(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetEditSuggestions>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetEditSuggestionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDatasetEditSuggestions>>
>;
export type GetDatasetEditSuggestionsQueryError = ErrorType<Error>;

export const useGetDatasetEditSuggestions = <
  TData = Awaited<ReturnType<typeof getDatasetEditSuggestions>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetEditSuggestionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetEditSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetEditSuggestionsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postDatasetEditSuggestions = (
  datasetEditSuggestionRequest: DatasetEditSuggestionRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetEditSuggestionResponse>(
    {
      url: `/dataset-edit-suggestions`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: datasetEditSuggestionRequest,
    },
    options,
  );
};

export const getPostDatasetEditSuggestionsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasetEditSuggestions>>,
    TError,
    { data: DatasetEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postDatasetEditSuggestions>>,
  TError,
  { data: DatasetEditSuggestionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postDatasetEditSuggestions>>,
    { data: DatasetEditSuggestionRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postDatasetEditSuggestions(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostDatasetEditSuggestionsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postDatasetEditSuggestions>>
>;
export type PostDatasetEditSuggestionsMutationBody = DatasetEditSuggestionRequest;
export type PostDatasetEditSuggestionsMutationError = ErrorType<Error>;

export const usePostDatasetEditSuggestions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postDatasetEditSuggestions>>,
    TError,
    { data: DatasetEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostDatasetEditSuggestionsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getDatasetEditSuggestionsId = (
  id: number,
  params?: GetDatasetEditSuggestionsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<DatasetEditSuggestionResponse>(
    { url: `/dataset-edit-suggestions/${id}`, method: "get", params, signal },
    options,
  );
};

export const getGetDatasetEditSuggestionsIdQueryKey = (
  id: number,
  params?: GetDatasetEditSuggestionsIdParams,
) => {
  return [`/dataset-edit-suggestions/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetDatasetEditSuggestionsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetEditSuggestionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetEditSuggestionsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>> = ({
    signal,
  }) => getDatasetEditSuggestionsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDatasetEditSuggestionsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>
>;
export type GetDatasetEditSuggestionsIdQueryError = ErrorType<Error>;

export const useGetDatasetEditSuggestionsId = <
  TData = Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetDatasetEditSuggestionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDatasetEditSuggestionsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetEditSuggestionsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putDatasetEditSuggestionsId = (
  id: number,
  datasetEditSuggestionRequest: DatasetEditSuggestionRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<DatasetEditSuggestionResponse>(
    {
      url: `/dataset-edit-suggestions/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: datasetEditSuggestionRequest,
    },
    options,
  );
};

export const getPutDatasetEditSuggestionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetEditSuggestionsId>>,
    TError,
    { id: number; data: DatasetEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putDatasetEditSuggestionsId>>,
  TError,
  { id: number; data: DatasetEditSuggestionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putDatasetEditSuggestionsId>>,
    { id: number; data: DatasetEditSuggestionRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putDatasetEditSuggestionsId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutDatasetEditSuggestionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putDatasetEditSuggestionsId>>
>;
export type PutDatasetEditSuggestionsIdMutationBody = DatasetEditSuggestionRequest;
export type PutDatasetEditSuggestionsIdMutationError = ErrorType<Error>;

export const usePutDatasetEditSuggestionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putDatasetEditSuggestionsId>>,
    TError,
    { id: number; data: DatasetEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutDatasetEditSuggestionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteDatasetEditSuggestionsId = (
  id: number,
  options?: SecondParameter<typeof API>,
) => {
  return API<number>({ url: `/dataset-edit-suggestions/${id}`, method: "delete" }, options);
};

export const getDeleteDatasetEditSuggestionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetEditSuggestionsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteDatasetEditSuggestionsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteDatasetEditSuggestionsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteDatasetEditSuggestionsId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteDatasetEditSuggestionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteDatasetEditSuggestionsId>>
>;

export type DeleteDatasetEditSuggestionsIdMutationError = ErrorType<Error>;

export const useDeleteDatasetEditSuggestionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteDatasetEditSuggestionsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteDatasetEditSuggestionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};