/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query'
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'
import type {
  Error,
  GetAuthEmailConfirmationParams,
  PostAuthChangePasswordBody,
  PostAuthForgotPassword200,
  PostAuthForgotPasswordBody,
  PostAuthLocalBody,
  PostAuthLocalRegisterBody,
  PostAuthResetPasswordBody,
  PostAuthSendEmailConfirmation200,
  PostAuthSendEmailConfirmationBody,
  UsersPermissionsUserRegistration
} from './strapi.schemas'
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';



// eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;


/**
 * Redirects to provider login before being redirect to /auth/{provider}/callback
 * @summary Login with a provider
 */
export const getConnectProvider = (
    provider: string,
 options?: SecondParameter<typeof API>,signal?: AbortSignal
) => {
      
      
      return API<Error>(
      {url: `/connect/${provider}`, method: 'get', signal
    },
      options);
    }
  

export const getGetConnectProviderQueryKey = (provider: string,) => {
    
    return [`/connect/${provider}`] as const;
    }

    
export const getGetConnectProviderQueryOptions = <TData = Awaited<ReturnType<typeof getConnectProvider>>, TError = ErrorType<void | Error>>(provider: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getConnectProvider>>, TError, TData>, request?: SecondParameter<typeof API>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetConnectProviderQueryKey(provider);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getConnectProvider>>> = ({ signal }) => getConnectProvider(provider, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(provider), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getConnectProvider>>, TError, TData> & { queryKey: QueryKey }
}

export type GetConnectProviderQueryResult = NonNullable<Awaited<ReturnType<typeof getConnectProvider>>>
export type GetConnectProviderQueryError = ErrorType<void | Error>

/**
 * @summary Login with a provider
 */
export const useGetConnectProvider = <TData = Awaited<ReturnType<typeof getConnectProvider>>, TError = ErrorType<void | Error>>(
 provider: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getConnectProvider>>, TError, TData>, request?: SecondParameter<typeof API>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetConnectProviderQueryOptions(provider,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * Returns a jwt token and user info
 * @summary Local login
 */
export const postAuthLocal = (
    postAuthLocalBody: PostAuthLocalBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<UsersPermissionsUserRegistration>(
      {url: `/auth/local`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthLocalBody
    },
      options);
    }
  


export const getPostAuthLocalMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLocal>>, TError,{data: PostAuthLocalBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthLocal>>, TError,{data: PostAuthLocalBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthLocal>>, {data: PostAuthLocalBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthLocal(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthLocalMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthLocal>>>
    export type PostAuthLocalMutationBody = PostAuthLocalBody
    export type PostAuthLocalMutationError = ErrorType<Error>

    /**
 * @summary Local login
 */
export const usePostAuthLocal = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLocal>>, TError,{data: PostAuthLocalBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthLocalMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * Returns a jwt token and user info
 * @summary Register a user
 */
export const postAuthLocalRegister = (
    postAuthLocalRegisterBody: PostAuthLocalRegisterBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<UsersPermissionsUserRegistration>(
      {url: `/auth/local/register`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthLocalRegisterBody
    },
      options);
    }
  


export const getPostAuthLocalRegisterMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLocalRegister>>, TError,{data: PostAuthLocalRegisterBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthLocalRegister>>, TError,{data: PostAuthLocalRegisterBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthLocalRegister>>, {data: PostAuthLocalRegisterBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthLocalRegister(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthLocalRegisterMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthLocalRegister>>>
    export type PostAuthLocalRegisterMutationBody = PostAuthLocalRegisterBody
    export type PostAuthLocalRegisterMutationError = ErrorType<Error>

    /**
 * @summary Register a user
 */
export const usePostAuthLocalRegister = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLocalRegister>>, TError,{data: PostAuthLocalRegisterBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthLocalRegisterMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Default Callback from provider auth
 */
export const getAuthProviderCallback = (
    provider: string,
 options?: SecondParameter<typeof API>,signal?: AbortSignal
) => {
      
      
      return API<UsersPermissionsUserRegistration>(
      {url: `/auth/${provider}/callback`, method: 'get', signal
    },
      options);
    }
  

export const getGetAuthProviderCallbackQueryKey = (provider: string,) => {
    
    return [`/auth/${provider}/callback`] as const;
    }

    
export const getGetAuthProviderCallbackQueryOptions = <TData = Awaited<ReturnType<typeof getAuthProviderCallback>>, TError = ErrorType<Error>>(provider: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAuthProviderCallback>>, TError, TData>, request?: SecondParameter<typeof API>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAuthProviderCallbackQueryKey(provider);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthProviderCallback>>> = ({ signal }) => getAuthProviderCallback(provider, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(provider), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAuthProviderCallback>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAuthProviderCallbackQueryResult = NonNullable<Awaited<ReturnType<typeof getAuthProviderCallback>>>
export type GetAuthProviderCallbackQueryError = ErrorType<Error>

/**
 * @summary Default Callback from provider auth
 */
export const useGetAuthProviderCallback = <TData = Awaited<ReturnType<typeof getAuthProviderCallback>>, TError = ErrorType<Error>>(
 provider: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAuthProviderCallback>>, TError, TData>, request?: SecondParameter<typeof API>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetAuthProviderCallbackQueryOptions(provider,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary Send rest password email
 */
export const postAuthForgotPassword = (
    postAuthForgotPasswordBody: PostAuthForgotPasswordBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<PostAuthForgotPassword200>(
      {url: `/auth/forgot-password`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthForgotPasswordBody
    },
      options);
    }
  


export const getPostAuthForgotPasswordMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthForgotPassword>>, TError,{data: PostAuthForgotPasswordBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthForgotPassword>>, TError,{data: PostAuthForgotPasswordBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthForgotPassword>>, {data: PostAuthForgotPasswordBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthForgotPassword(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthForgotPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthForgotPassword>>>
    export type PostAuthForgotPasswordMutationBody = PostAuthForgotPasswordBody
    export type PostAuthForgotPasswordMutationError = ErrorType<Error>

    /**
 * @summary Send rest password email
 */
export const usePostAuthForgotPassword = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthForgotPassword>>, TError,{data: PostAuthForgotPasswordBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthForgotPasswordMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Rest user password
 */
export const postAuthResetPassword = (
    postAuthResetPasswordBody: PostAuthResetPasswordBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<UsersPermissionsUserRegistration>(
      {url: `/auth/reset-password`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthResetPasswordBody
    },
      options);
    }
  


export const getPostAuthResetPasswordMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthResetPassword>>, TError,{data: PostAuthResetPasswordBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthResetPassword>>, TError,{data: PostAuthResetPasswordBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthResetPassword>>, {data: PostAuthResetPasswordBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthResetPassword(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthResetPassword>>>
    export type PostAuthResetPasswordMutationBody = PostAuthResetPasswordBody
    export type PostAuthResetPasswordMutationError = ErrorType<Error>

    /**
 * @summary Rest user password
 */
export const usePostAuthResetPassword = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthResetPassword>>, TError,{data: PostAuthResetPasswordBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthResetPasswordMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Update user's own password
 */
export const postAuthChangePassword = (
    postAuthChangePasswordBody: PostAuthChangePasswordBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<UsersPermissionsUserRegistration>(
      {url: `/auth/change-password`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthChangePasswordBody
    },
      options);
    }
  


export const getPostAuthChangePasswordMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthChangePassword>>, TError,{data: PostAuthChangePasswordBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthChangePassword>>, TError,{data: PostAuthChangePasswordBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthChangePassword>>, {data: PostAuthChangePasswordBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthChangePassword(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthChangePasswordMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthChangePassword>>>
    export type PostAuthChangePasswordMutationBody = PostAuthChangePasswordBody
    export type PostAuthChangePasswordMutationError = ErrorType<Error>

    /**
 * @summary Update user's own password
 */
export const usePostAuthChangePassword = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthChangePassword>>, TError,{data: PostAuthChangePasswordBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthChangePasswordMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Confirm user email
 */
export const getAuthEmailConfirmation = (
    params?: GetAuthEmailConfirmationParams,
 options?: SecondParameter<typeof API>,signal?: AbortSignal
) => {
      
      
      return API<Error>(
      {url: `/auth/email-confirmation`, method: 'get',
        params, signal
    },
      options);
    }
  

export const getGetAuthEmailConfirmationQueryKey = (params?: GetAuthEmailConfirmationParams,) => {
    
    return [`/auth/email-confirmation`, ...(params ? [params]: [])] as const;
    }

    
export const getGetAuthEmailConfirmationQueryOptions = <TData = Awaited<ReturnType<typeof getAuthEmailConfirmation>>, TError = ErrorType<void | Error>>(params?: GetAuthEmailConfirmationParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAuthEmailConfirmation>>, TError, TData>, request?: SecondParameter<typeof API>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAuthEmailConfirmationQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthEmailConfirmation>>> = ({ signal }) => getAuthEmailConfirmation(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAuthEmailConfirmation>>, TError, TData> & { queryKey: QueryKey }
}

export type GetAuthEmailConfirmationQueryResult = NonNullable<Awaited<ReturnType<typeof getAuthEmailConfirmation>>>
export type GetAuthEmailConfirmationQueryError = ErrorType<void | Error>

/**
 * @summary Confirm user email
 */
export const useGetAuthEmailConfirmation = <TData = Awaited<ReturnType<typeof getAuthEmailConfirmation>>, TError = ErrorType<void | Error>>(
 params?: GetAuthEmailConfirmationParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAuthEmailConfirmation>>, TError, TData>, request?: SecondParameter<typeof API>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetAuthEmailConfirmationQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary Send confirmation email
 */
export const postAuthSendEmailConfirmation = (
    postAuthSendEmailConfirmationBody: PostAuthSendEmailConfirmationBody,
 options?: SecondParameter<typeof API>,) => {
      
      
      return API<PostAuthSendEmailConfirmation200>(
      {url: `/auth/send-email-confirmation`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: postAuthSendEmailConfirmationBody
    },
      options);
    }
  


export const getPostAuthSendEmailConfirmationMutationOptions = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthSendEmailConfirmation>>, TError,{data: PostAuthSendEmailConfirmationBody}, TContext>, request?: SecondParameter<typeof API>}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthSendEmailConfirmation>>, TError,{data: PostAuthSendEmailConfirmationBody}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthSendEmailConfirmation>>, {data: PostAuthSendEmailConfirmationBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthSendEmailConfirmation(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type PostAuthSendEmailConfirmationMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthSendEmailConfirmation>>>
    export type PostAuthSendEmailConfirmationMutationBody = PostAuthSendEmailConfirmationBody
    export type PostAuthSendEmailConfirmationMutationError = ErrorType<Error>

    /**
 * @summary Send confirmation email
 */
export const usePostAuthSendEmailConfirmation = <TError = ErrorType<Error>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthSendEmailConfirmation>>, TError,{data: PostAuthSendEmailConfirmationBody}, TContext>, request?: SecondParameter<typeof API>}
) => {

      const mutationOptions = getPostAuthSendEmailConfirmationMutationOptions(options);

      return useMutation(mutationOptions);
    }
    