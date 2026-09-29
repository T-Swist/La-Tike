import { baseApi } from '../baseApi';

// Customer-specific API endpoints
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Browse events
    getEvents: builder.query({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Events'],
    }),
    
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: ['Events'],
    }),
    
    searchEvents: builder.query({
      query: (searchTerm) => ({
        url: '/events',
        params: { search: searchTerm },
      }),
      providesTags: ['Events'],
    }),
    
    // Purchase tickets
    purchaseTicket: builder.mutation({
      query: (data) => ({
        url: '/tickets/purchase',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tickets'],
    }),
    
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/tickets/confirm-payment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tickets'],
    }),
    
    // My tickets
    getMyTickets: builder.query({
      query: () => '/tickets/my-tickets',
      providesTags: ['Tickets'],
    }),
    
    getTicketById: builder.query({
      query: (id) => `/tickets/${id}`,
      providesTags: ['Tickets'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useSearchEventsQuery,
  usePurchaseTicketMutation,
  useConfirmPaymentMutation,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
} = customerApi;