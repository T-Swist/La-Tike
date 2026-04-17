import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events', 'Users', 'Tickets', 'Payments', 'Stats'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Dashboard stats
    getDashboardStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),
    
    // Events
    getEvents: builder.query({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Events'],
    }),
    
    // Users
    getUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    
    // Tickets
    getTickets: builder.query({
      query: () => '/admin/tickets',
      providesTags: ['Tickets'],
    }),
    
    // Payments
    getPayments: builder.query({
      query: () => '/admin/payments',
      providesTags: ['Payments'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardStatsQuery,
  useGetEventsQuery,
  useGetUsersQuery,
  useGetTicketsQuery,
  useGetPaymentsQuery,
} = api;
