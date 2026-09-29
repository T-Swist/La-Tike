import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import config from '../../config/env';

const baseQuery = fetchBaseQuery({
  baseUrl: config.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
  timeout: 10000,
  credentials: 'include',
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        const { accessToken } = (refreshResult.data as any).data;
        api.dispatch({ type: 'auth/updateToken', payload: accessToken });
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch({ type: 'auth/logout' });
      }
    }
  }
  
  return result;
};

// Base API with auth endpoints (shared by both customer and host)
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events', 'Tickets', 'User', 'MyEvents', 'Sales'],
  endpoints: (builder) => ({
    // Shared auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = baseApi;