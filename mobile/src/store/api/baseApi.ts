import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import config from '../../config/env';
import { logout, updateTokens } from '../slices/authSlice';
import type { ApiResponse, AuthPayload, User } from '../../types/api';

const baseQuery = fetchBaseQuery({
  baseUrl: config.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
  timeout: 15000,
});

// Shared between concurrent requests so a burst of 401s triggers only one refresh
// (the server rotates refresh tokens, so parallel refreshes would log the user out).
let refreshInFlight: Promise<boolean> | null = null;

const isAuthEndpoint = (args: string | FetchArgs) => {
  const url = typeof args === 'string' ? args : args.url;
  return url.startsWith('/auth/login') || url.startsWith('/auth/register') || url.startsWith('/auth/refresh');
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAuthEndpoint(args)) {
    return result;
  }

  const refreshToken = (api.getState() as RootState).auth.refreshToken;
  if (!refreshToken) {
    api.dispatch(logout());
    return result;
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );
      const tokens = (refreshResult.data as ApiResponse<{ accessToken: string; refreshToken: string }>)?.data;
      if (tokens?.accessToken) {
        api.dispatch(updateTokens(tokens));
        return true;
      }
      api.dispatch(logout());
      return false;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  if (await refreshInFlight) {
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

// Base API with auth endpoints (shared by both customer and host)
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events', 'Tickets', 'User', 'MyEvents'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthPayload>, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      ApiResponse<AuthPayload>,
      { email: string; password: string; firstName: string; lastName: string; role: 'CUSTOMER' | 'HOST' }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = baseApi;
