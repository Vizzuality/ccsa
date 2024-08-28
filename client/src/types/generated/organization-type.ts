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
  GetOrganizationTypesIdParams,
  GetOrganizationTypesParams,
  OrganizationTypeListResponse,
  OrganizationTypeRequest,
  OrganizationTypeResponse,
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

export const getOrganizationTypes = (
  params?: GetOrganizationTypesParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<OrganizationTypeListResponse>(
    { url: `/organization-types`, method: "get", params, signal },
    options,
  );
};

export const getGetOrganizationTypesQueryKey = (params?: GetOrganizationTypesParams) => {
  return [`/organization-types`, ...(params ? [params] : [])] as const;
};

export const getGetOrganizationTypesQueryOptions = <
  TData = Awaited<ReturnType<typeof getOrganizationTypes>>,
  TError = ErrorType<Error>,
>(
  params?: GetOrganizationTypesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationTypes>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetOrganizationTypesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrganizationTypes>>> = ({ signal }) =>
    getOrganizationTypes(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getOrganizationTypes>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetOrganizationTypesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getOrganizationTypes>>
>;
export type GetOrganizationTypesQueryError = ErrorType<Error>;

export const useGetOrganizationTypes = <
  TData = Awaited<ReturnType<typeof getOrganizationTypes>>,
  TError = ErrorType<Error>,
>(
  params?: GetOrganizationTypesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationTypes>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetOrganizationTypesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postOrganizationTypes = (
  organizationTypeRequest: OrganizationTypeRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<OrganizationTypeResponse>(
    {
      url: `/organization-types`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: organizationTypeRequest,
    },
    options,
  );
};

export const getPostOrganizationTypesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postOrganizationTypes>>,
    TError,
    { data: OrganizationTypeRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postOrganizationTypes>>,
  TError,
  { data: OrganizationTypeRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postOrganizationTypes>>,
    { data: OrganizationTypeRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postOrganizationTypes(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostOrganizationTypesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postOrganizationTypes>>
>;
export type PostOrganizationTypesMutationBody = OrganizationTypeRequest;
export type PostOrganizationTypesMutationError = ErrorType<Error>;

export const usePostOrganizationTypes = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postOrganizationTypes>>,
    TError,
    { data: OrganizationTypeRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostOrganizationTypesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getOrganizationTypesId = (
  id: number,
  params?: GetOrganizationTypesIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<OrganizationTypeResponse>(
    { url: `/organization-types/${id}`, method: "get", params, signal },
    options,
  );
};

export const getGetOrganizationTypesIdQueryKey = (
  id: number,
  params?: GetOrganizationTypesIdParams,
) => {
  return [`/organization-types/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetOrganizationTypesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getOrganizationTypesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetOrganizationTypesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationTypesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetOrganizationTypesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrganizationTypesId>>> = ({ signal }) =>
    getOrganizationTypesId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getOrganizationTypesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetOrganizationTypesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getOrganizationTypesId>>
>;
export type GetOrganizationTypesIdQueryError = ErrorType<Error>;

export const useGetOrganizationTypesId = <
  TData = Awaited<ReturnType<typeof getOrganizationTypesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetOrganizationTypesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationTypesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetOrganizationTypesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putOrganizationTypesId = (
  id: number,
  organizationTypeRequest: OrganizationTypeRequest,
  options?: SecondParameter<typeof API>,
) => {
  return API<OrganizationTypeResponse>(
    {
      url: `/organization-types/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: organizationTypeRequest,
    },
    options,
  );
};

export const getPutOrganizationTypesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putOrganizationTypesId>>,
    TError,
    { id: number; data: OrganizationTypeRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putOrganizationTypesId>>,
  TError,
  { id: number; data: OrganizationTypeRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putOrganizationTypesId>>,
    { id: number; data: OrganizationTypeRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putOrganizationTypesId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutOrganizationTypesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putOrganizationTypesId>>
>;
export type PutOrganizationTypesIdMutationBody = OrganizationTypeRequest;
export type PutOrganizationTypesIdMutationError = ErrorType<Error>;

export const usePutOrganizationTypesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putOrganizationTypesId>>,
    TError,
    { id: number; data: OrganizationTypeRequest },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutOrganizationTypesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteOrganizationTypesId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/organization-types/${id}`, method: "delete" }, options);
};

export const getDeleteOrganizationTypesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteOrganizationTypesId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteOrganizationTypesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteOrganizationTypesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteOrganizationTypesId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteOrganizationTypesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteOrganizationTypesId>>
>;

export type DeleteOrganizationTypesIdMutationError = ErrorType<Error>;

export const useDeleteOrganizationTypesId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteOrganizationTypesId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteOrganizationTypesIdMutationOptions(options);

  return useMutation(mutationOptions);
};