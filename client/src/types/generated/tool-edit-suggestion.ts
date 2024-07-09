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
  GetToolEditSuggestionsIdParams,
  GetToolEditSuggestionsParams,
  ToolEditSuggestionListResponse,
  ToolEditSuggestionRequest,
  ToolEditSuggestionResponse,
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

export const getToolEditSuggestions = (
  params?: GetToolEditSuggestionsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<ToolEditSuggestionListResponse>(
    { url: `/tool-edit-suggestions`, method: "get", params, signal },
    options,
  );
};

export const getGetToolEditSuggestionsQueryKey = (params?: GetToolEditSuggestionsParams) => {
  return [`/tool-edit-suggestions`, ...(params ? [params] : [])] as const;
};

export const getGetToolEditSuggestionsQueryOptions = <
  TData = Awaited<ReturnType<typeof getToolEditSuggestions>>,
  TError = ErrorType<Error>,
>(
  params?: GetToolEditSuggestionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolEditSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetToolEditSuggestionsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getToolEditSuggestions>>> = ({ signal }) =>
    getToolEditSuggestions(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getToolEditSuggestions>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetToolEditSuggestionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getToolEditSuggestions>>
>;
export type GetToolEditSuggestionsQueryError = ErrorType<Error>;

export const useGetToolEditSuggestions = <
  TData = Awaited<ReturnType<typeof getToolEditSuggestions>>,
  TError = ErrorType<Error>,
>(
  params?: GetToolEditSuggestionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolEditSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetToolEditSuggestionsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postToolEditSuggestions = (
  toolEditSuggestionRequest: ToolEditSuggestionRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<ToolEditSuggestionResponse>(
    {
      url: `/tool-edit-suggestions`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: toolEditSuggestionRequest,
    },
    options,
  );
};

export const getPostToolEditSuggestionsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postToolEditSuggestions>>,
    TError,
    { data: ToolEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postToolEditSuggestions>>,
  TError,
  { data: ToolEditSuggestionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postToolEditSuggestions>>,
    { data: ToolEditSuggestionRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postToolEditSuggestions(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostToolEditSuggestionsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postToolEditSuggestions>>
>;
export type PostToolEditSuggestionsMutationBody = ToolEditSuggestionRequest;
export type PostToolEditSuggestionsMutationError = ErrorType<Error>;

export const usePostToolEditSuggestions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postToolEditSuggestions>>,
    TError,
    { data: ToolEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostToolEditSuggestionsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getToolEditSuggestionsId = (
  id: number,
  params?: GetToolEditSuggestionsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<ToolEditSuggestionResponse>(
    { url: `/tool-edit-suggestions/${id}`, method: "get", params, signal },
    options,
  );
};

export const getGetToolEditSuggestionsIdQueryKey = (
  id: number,
  params?: GetToolEditSuggestionsIdParams,
) => {
  return [`/tool-edit-suggestions/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetToolEditSuggestionsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getToolEditSuggestionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetToolEditSuggestionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolEditSuggestionsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetToolEditSuggestionsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getToolEditSuggestionsId>>> = ({
    signal,
  }) => getToolEditSuggestionsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getToolEditSuggestionsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetToolEditSuggestionsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getToolEditSuggestionsId>>
>;
export type GetToolEditSuggestionsIdQueryError = ErrorType<Error>;

export const useGetToolEditSuggestionsId = <
  TData = Awaited<ReturnType<typeof getToolEditSuggestionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetToolEditSuggestionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolEditSuggestionsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetToolEditSuggestionsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putToolEditSuggestionsId = (
  id: number,
  toolEditSuggestionRequest: ToolEditSuggestionRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<ToolEditSuggestionResponse>(
    {
      url: `/tool-edit-suggestions/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: toolEditSuggestionRequest,
    },
    options,
  );
};

export const getPutToolEditSuggestionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putToolEditSuggestionsId>>,
    TError,
    { id: number; data: ToolEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putToolEditSuggestionsId>>,
  TError,
  { id: number; data: ToolEditSuggestionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putToolEditSuggestionsId>>,
    { id: number; data: ToolEditSuggestionRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putToolEditSuggestionsId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutToolEditSuggestionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putToolEditSuggestionsId>>
>;
export type PutToolEditSuggestionsIdMutationBody = ToolEditSuggestionRequest;
export type PutToolEditSuggestionsIdMutationError = ErrorType<Error>;

export const usePutToolEditSuggestionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putToolEditSuggestionsId>>,
    TError,
    { id: number; data: ToolEditSuggestionRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutToolEditSuggestionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteToolEditSuggestionsId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/tool-edit-suggestions/${id}`, method: "delete" }, options);
};

export const getDeleteToolEditSuggestionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteToolEditSuggestionsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteToolEditSuggestionsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteToolEditSuggestionsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteToolEditSuggestionsId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteToolEditSuggestionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteToolEditSuggestionsId>>
>;

export type DeleteToolEditSuggestionsIdMutationError = ErrorType<Error>;

export const useDeleteToolEditSuggestionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteToolEditSuggestionsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteToolEditSuggestionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};