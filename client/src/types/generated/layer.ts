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
  GetLayersIdParams,
  GetLayersParams,
  LayerListResponse,
  LayerRequest,
  LayerResponse,
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

export const getLayers = (
  params?: GetLayersParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<LayerListResponse>({ url: `/layers`, method: "get", params, signal }, options);
};

export const getGetLayersQueryKey = (params?: GetLayersParams) => {
  return [`/layers`, ...(params ? [params] : [])] as const;
};

export const getGetLayersQueryOptions = <
  TData = Awaited<ReturnType<typeof getLayers>>,
  TError = ErrorType<Error>,
>(
  params?: GetLayersParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLayers>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetLayersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getLayers>>> = ({ signal }) =>
    getLayers(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getLayers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetLayersQueryResult = NonNullable<Awaited<ReturnType<typeof getLayers>>>;
export type GetLayersQueryError = ErrorType<Error>;

export const useGetLayers = <
  TData = Awaited<ReturnType<typeof getLayers>>,
  TError = ErrorType<Error>,
>(
  params?: GetLayersParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLayers>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetLayersQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postLayers = (layerRequest: LayerRequest, options?: SecondParameter<typeof API>) => {
  return API<LayerResponse>(
    {
      url: `/layers`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: layerRequest,
    },
    options,
  );
};

export const getPostLayersMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postLayers>>,
    TError,
    { data: LayerRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postLayers>>,
  TError,
  { data: LayerRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postLayers>>,
    { data: LayerRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postLayers(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostLayersMutationResult = NonNullable<Awaited<ReturnType<typeof postLayers>>>;
export type PostLayersMutationBody = LayerRequest;
export type PostLayersMutationError = ErrorType<Error>;

export const usePostLayers = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postLayers>>,
    TError,
    { data: LayerRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostLayersMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getLayersId = (
  id: number,
  params?: GetLayersIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<LayerResponse>({ url: `/layers/${id}`, method: "get", params, signal }, options);
};

export const getGetLayersIdQueryKey = (id: number, params?: GetLayersIdParams) => {
  return [`/layers/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetLayersIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getLayersId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetLayersIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLayersId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetLayersIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getLayersId>>> = ({ signal }) =>
    getLayersId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getLayersId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetLayersIdQueryResult = NonNullable<Awaited<ReturnType<typeof getLayersId>>>;
export type GetLayersIdQueryError = ErrorType<Error>;

export const useGetLayersId = <
  TData = Awaited<ReturnType<typeof getLayersId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetLayersIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLayersId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetLayersIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putLayersId = (
  id: number,
  layerRequest: LayerRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<LayerResponse>(
    {
      url: `/layers/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: layerRequest,
    },
    options,
  );
};

export const getPutLayersIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putLayersId>>,
    TError,
    { id: number; data: LayerRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putLayersId>>,
  TError,
  { id: number; data: LayerRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putLayersId>>,
    { id: number; data: LayerRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putLayersId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutLayersIdMutationResult = NonNullable<Awaited<ReturnType<typeof putLayersId>>>;
export type PutLayersIdMutationBody = LayerRequest;
export type PutLayersIdMutationError = ErrorType<Error>;

export const usePutLayersId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putLayersId>>,
    TError,
    { id: number; data: LayerRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutLayersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteLayersId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/layers/${id}`, method: "delete" }, options);
};

export const getDeleteLayersIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteLayersId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteLayersId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteLayersId>>, { id: number }> = (
    props,
  ) => {
    const { id } = props ?? {};

    return deleteLayersId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteLayersIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteLayersId>>>;

export type DeleteLayersIdMutationError = ErrorType<Error>;

export const useDeleteLayersId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteLayersId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteLayersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
