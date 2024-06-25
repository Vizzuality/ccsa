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
  DeleteUsersPermissionsRolesRole200,
  Error,
  GetUsersIdParams,
  GetUsersPermissionsPermissions200,
  GetUsersPermissionsRoles200,
  GetUsersPermissionsRolesId200,
  GetUsersPermissionsRolesIdParams,
  PostUsers201,
  PostUsersBody,
  PostUsersPermissionsRoles200,
  PutUsersId200,
  PutUsersIdBody,
  PutUsersPermissionsRolesRole200,
  UsersPermissionsRoleRequestBody,
  UsersPermissionsUser,
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

/**
 * @summary Get default generated permissions
 */
export const getUsersPermissionsPermissions = (
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<GetUsersPermissionsPermissions200>(
    { url: `/users-permissions/permissions`, method: "get", signal },
    options,
  );
};

export const getGetUsersPermissionsPermissionsQueryKey = () => {
  return [`/users-permissions/permissions`] as const;
};

export const getGetUsersPermissionsPermissionsQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsPermissions>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUsersPermissionsPermissions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersPermissionsPermissionsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersPermissionsPermissions>>> = ({
    signal,
  }) => getUsersPermissionsPermissions(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersPermissionsPermissions>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersPermissionsPermissionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersPermissionsPermissions>>
>;
export type GetUsersPermissionsPermissionsQueryError = ErrorType<Error>;

/**
 * @summary Get default generated permissions
 */
export const useGetUsersPermissionsPermissions = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsPermissions>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUsersPermissionsPermissions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof API>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersPermissionsPermissionsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary List roles
 */
export const getUsersPermissionsRoles = (
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<GetUsersPermissionsRoles200>(
    { url: `/users-permissions/roles`, method: "get", signal },
    options,
  );
};

export const getGetUsersPermissionsRolesQueryKey = () => {
  return [`/users-permissions/roles`] as const;
};

export const getGetUsersPermissionsRolesQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsRoles>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersPermissionsRoles>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersPermissionsRolesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersPermissionsRoles>>> = ({
    signal,
  }) => getUsersPermissionsRoles(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersPermissionsRoles>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersPermissionsRolesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersPermissionsRoles>>
>;
export type GetUsersPermissionsRolesQueryError = ErrorType<Error>;

/**
 * @summary List roles
 */
export const useGetUsersPermissionsRoles = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsRoles>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersPermissionsRoles>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersPermissionsRolesQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Create a role
 */
export const postUsersPermissionsRoles = (
  usersPermissionsRoleRequestBody: UsersPermissionsRoleRequestBody,
  options?: SecondParameter<typeof API>,
) => {
  return API<PostUsersPermissionsRoles200>(
    {
      url: `/users-permissions/roles`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: usersPermissionsRoleRequestBody,
    },
    options,
  );
};

export const getPostUsersPermissionsRolesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersPermissionsRoles>>,
    TError,
    { data: UsersPermissionsRoleRequestBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUsersPermissionsRoles>>,
  TError,
  { data: UsersPermissionsRoleRequestBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUsersPermissionsRoles>>,
    { data: UsersPermissionsRoleRequestBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUsersPermissionsRoles(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUsersPermissionsRolesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postUsersPermissionsRoles>>
>;
export type PostUsersPermissionsRolesMutationBody = UsersPermissionsRoleRequestBody;
export type PostUsersPermissionsRolesMutationError = ErrorType<Error>;

/**
 * @summary Create a role
 */
export const usePostUsersPermissionsRoles = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersPermissionsRoles>>,
    TError,
    { data: UsersPermissionsRoleRequestBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostUsersPermissionsRolesMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Get a role
 */
export const getUsersPermissionsRolesId = (
  id: string,
  params?: GetUsersPermissionsRolesIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<GetUsersPermissionsRolesId200>(
    { url: `/users-permissions/roles/${id}`, method: "get", params, signal },
    options,
  );
};

export const getGetUsersPermissionsRolesIdQueryKey = (
  id: string,
  params?: GetUsersPermissionsRolesIdParams,
) => {
  return [`/users-permissions/roles/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetUsersPermissionsRolesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsRolesId>>,
  TError = ErrorType<Error>,
>(
  id: string,
  params?: GetUsersPermissionsRolesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersPermissionsRolesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersPermissionsRolesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersPermissionsRolesId>>> = ({
    signal,
  }) => getUsersPermissionsRolesId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersPermissionsRolesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersPermissionsRolesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersPermissionsRolesId>>
>;
export type GetUsersPermissionsRolesIdQueryError = ErrorType<Error>;

/**
 * @summary Get a role
 */
export const useGetUsersPermissionsRolesId = <
  TData = Awaited<ReturnType<typeof getUsersPermissionsRolesId>>,
  TError = ErrorType<Error>,
>(
  id: string,
  params?: GetUsersPermissionsRolesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersPermissionsRolesId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersPermissionsRolesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Update a role
 */
export const putUsersPermissionsRolesRole = (
  role: string,
  usersPermissionsRoleRequestBody: UsersPermissionsRoleRequestBody,
  options?: SecondParameter<typeof API>,
) => {
  return API<PutUsersPermissionsRolesRole200>(
    {
      url: `/users-permissions/roles/${role}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: usersPermissionsRoleRequestBody,
    },
    options,
  );
};

export const getPutUsersPermissionsRolesRoleMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putUsersPermissionsRolesRole>>,
    TError,
    { role: string; data: UsersPermissionsRoleRequestBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putUsersPermissionsRolesRole>>,
  TError,
  { role: string; data: UsersPermissionsRoleRequestBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putUsersPermissionsRolesRole>>,
    { role: string; data: UsersPermissionsRoleRequestBody }
  > = (props) => {
    const { role, data } = props ?? {};

    return putUsersPermissionsRolesRole(role, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutUsersPermissionsRolesRoleMutationResult = NonNullable<
  Awaited<ReturnType<typeof putUsersPermissionsRolesRole>>
>;
export type PutUsersPermissionsRolesRoleMutationBody = UsersPermissionsRoleRequestBody;
export type PutUsersPermissionsRolesRoleMutationError = ErrorType<Error>;

/**
 * @summary Update a role
 */
export const usePutUsersPermissionsRolesRole = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putUsersPermissionsRolesRole>>,
    TError,
    { role: string; data: UsersPermissionsRoleRequestBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutUsersPermissionsRolesRoleMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Delete a role
 */
export const deleteUsersPermissionsRolesRole = (
  role: string,
  options?: SecondParameter<typeof API>,
) => {
  return API<DeleteUsersPermissionsRolesRole200>(
    { url: `/users-permissions/roles/${role}`, method: "delete" },
    options,
  );
};

export const getDeleteUsersPermissionsRolesRoleMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUsersPermissionsRolesRole>>,
    TError,
    { role: string },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUsersPermissionsRolesRole>>,
  TError,
  { role: string },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteUsersPermissionsRolesRole>>,
    { role: string }
  > = (props) => {
    const { role } = props ?? {};

    return deleteUsersPermissionsRolesRole(role, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUsersPermissionsRolesRoleMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteUsersPermissionsRolesRole>>
>;

export type DeleteUsersPermissionsRolesRoleMutationError = ErrorType<Error>;

/**
 * @summary Delete a role
 */
export const useDeleteUsersPermissionsRolesRole = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUsersPermissionsRolesRole>>,
    TError,
    { role: string },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteUsersPermissionsRolesRoleMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Get list of users
 */
export const getUsers = (options?: SecondParameter<typeof API>, signal?: AbortSignal) => {
  return API<UsersPermissionsUser[]>({ url: `/users`, method: "get", signal }, options);
};

export const getGetUsersQueryKey = () => {
  return [`/users`] as const;
};

export const getGetUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) =>
    getUsers(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>;
export type GetUsersQueryError = ErrorType<Error>;

/**
 * @summary Get list of users
 */
export const useGetUsers = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Create a user
 */
export const postUsers = (postUsersBody: PostUsersBody, options?: SecondParameter<typeof API>) => {
  return API<PostUsers201>(
    {
      url: `/users`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: postUsersBody,
    },
    options,
  );
};

export const getPostUsersMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsers>>,
    TError,
    { data: PostUsersBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUsers>>,
  TError,
  { data: PostUsersBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUsers>>,
    { data: PostUsersBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUsers(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUsersMutationResult = NonNullable<Awaited<ReturnType<typeof postUsers>>>;
export type PostUsersMutationBody = PostUsersBody;
export type PostUsersMutationError = ErrorType<Error>;

/**
 * @summary Create a user
 */
export const usePostUsers = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsers>>,
    TError,
    { data: PostUsersBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostUsersMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Get a user
 */
export const getUsersId = (
  id: string,
  params?: GetUsersIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal,
) => {
  return API<UsersPermissionsUser>({ url: `/users/${id}`, method: "get", params, signal }, options);
};

export const getGetUsersIdQueryKey = (id: string, params?: GetUsersIdParams) => {
  return [`/users/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetUsersIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersId>>,
  TError = ErrorType<Error>,
>(
  id: string,
  params?: GetUsersIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersId>>> = ({ signal }) =>
    getUsersId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersIdQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersId>>>;
export type GetUsersIdQueryError = ErrorType<Error>;

/**
 * @summary Get a user
 */
export const useGetUsersId = <
  TData = Awaited<ReturnType<typeof getUsersId>>,
  TError = ErrorType<Error>,
>(
  id: string,
  params?: GetUsersIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Update a user
 */
export const putUsersId = (
  id: string,
  putUsersIdBody: PutUsersIdBody,
  options?: SecondParameter<typeof API>,
) => {
  return API<PutUsersId200>(
    {
      url: `/users/${id}`,
      method: "put",
      headers: { "Content-Type": "application/json" },
      data: putUsersIdBody,
    },
    options,
  );
};

export const getPutUsersIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putUsersId>>,
    TError,
    { id: string; data: PutUsersIdBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putUsersId>>,
  TError,
  { id: string; data: PutUsersIdBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putUsersId>>,
    { id: string; data: PutUsersIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putUsersId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutUsersIdMutationResult = NonNullable<Awaited<ReturnType<typeof putUsersId>>>;
export type PutUsersIdMutationBody = PutUsersIdBody;
export type PutUsersIdMutationError = ErrorType<Error>;

/**
 * @summary Update a user
 */
export const usePutUsersId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putUsersId>>,
    TError,
    { id: string; data: PutUsersIdBody },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutUsersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Delete a user
 */
export const deleteUsersId = (id: string, options?: SecondParameter<typeof API>) => {
  return API<UsersPermissionsUser>({ url: `/users/${id}`, method: "delete" }, options);
};

export const getDeleteUsersIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUsersId>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUsersId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUsersId>>, { id: string }> = (
    props,
  ) => {
    const { id } = props ?? {};

    return deleteUsersId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUsersIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUsersId>>>;

export type DeleteUsersIdMutationError = ErrorType<Error>;

/**
 * @summary Delete a user
 */
export const useDeleteUsersId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUsersId>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteUsersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Get authenticated user info
 */
export const getUsersMe = (options?: SecondParameter<typeof API>, signal?: AbortSignal) => {
  return API<UsersPermissionsUser>({ url: `/users/me`, method: "get", signal }, options);
};

export const getGetUsersMeQueryKey = () => {
  return [`/users/me`] as const;
};

export const getGetUsersMeQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersMe>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersMeQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersMe>>> = ({ signal }) =>
    getUsersMe(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersMeQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersMe>>>;
export type GetUsersMeQueryError = ErrorType<Error>;

/**
 * @summary Get authenticated user info
 */
export const useGetUsersMe = <
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersMe>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersMeQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Get user count
 */
export const getUsersCount = (options?: SecondParameter<typeof API>, signal?: AbortSignal) => {
  return API<number>({ url: `/users/count`, method: "get", signal }, options);
};

export const getGetUsersCountQueryKey = () => {
  return [`/users/count`] as const;
};

export const getGetUsersCountQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersCount>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersCount>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersCountQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersCount>>> = ({ signal }) =>
    getUsersCount(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersCount>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersCountQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersCount>>>;
export type GetUsersCountQueryError = ErrorType<Error>;

/**
 * @summary Get user count
 */
export const useGetUsersCount = <
  TData = Awaited<ReturnType<typeof getUsersCount>>,
  TError = ErrorType<Error>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsersCount>>, TError, TData>;
  request?: SecondParameter<typeof API>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetUsersCountQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};