import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  ConfirmPaymentResponse,
  Event,
  PurchaseRequest,
  PurchaseResponse,
  Ticket,
} from '../../../types/api';

// Customer-specific API endpoints
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Browse events
    getEvents: builder.query<Event[], { search?: string; category?: string; upcoming?: boolean } | void>({
      query: (params) => ({
        url: '/events',
        params: { upcoming: true, limit: 50, ...(params ?? {}) },
      }),
      transformResponse: (response: ApiResponse<Event[]>) => response.data,
      providesTags: ['Events'],
    }),

    getEventById: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
      transformResponse: (response: ApiResponse<Event>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Events', id }],
    }),

    // Purchase tickets
    purchaseTicket: builder.mutation<PurchaseResponse, PurchaseRequest>({
      query: (data) => ({
        url: '/tickets/purchase',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<PurchaseResponse>) => response.data,
      invalidatesTags: ['Tickets', 'Events'],
    }),

    confirmPayment: builder.mutation<ConfirmPaymentResponse, { paymentIntentId: string }>({
      query: (data) => ({
        url: '/tickets/confirm-payment',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ConfirmPaymentResponse>) => response.data,
      invalidatesTags: ['Tickets', 'Events'],
    }),

    // My tickets
    getMyTickets: builder.query<Ticket[], void>({
      query: () => '/tickets/my-tickets',
      transformResponse: (response: ApiResponse<Ticket[]>) => response.data,
      providesTags: ['Tickets'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  usePurchaseTicketMutation,
  useConfirmPaymentMutation,
  useGetMyTicketsQuery,
} = customerApi;
