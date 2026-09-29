import { baseApi } from '../baseApi';

// Host-specific API endpoints
export const hostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Event management
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['MyEvents'],
    }),
    
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MyEvents', 'Events'],
    }),
    
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyEvents', 'Events'],
    }),
    
    getMyEvents: builder.query({
      query: () => '/events/my-events',
      providesTags: ['MyEvents'],
    }),
    
    // Ticket type management
    createTicketType: builder.mutation({
      query: ({ eventId, ...data }) => ({
        url: `/events/${eventId}/ticket-types`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyEvents'],
    }),
    
    updateTicketType: builder.mutation({
      query: ({ eventId, ticketTypeId, ...data }) => ({
        url: `/events/${eventId}/ticket-types/${ticketTypeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MyEvents'],
    }),
    
    // Sales & Analytics
    getEventSales: builder.query({
      query: (eventId) => `/events/${eventId}/sales`,
      providesTags: ['Sales'],
    }),
    
    getEventAnalytics: builder.query({
      query: (eventId) => `/events/${eventId}/analytics`,
      providesTags: ['Sales'],
    }),
    
    // Ticket scanning
    scanTicket: builder.mutation({
      query: (data) => ({
        url: '/tickets/scan',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sales'],
    }),
    
    // Image upload
    uploadEventImage: builder.mutation({
      query: ({ eventId, formData }) => ({
        url: `/events/${eventId}/upload-image`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['MyEvents'],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetMyEventsQuery,
  useCreateTicketTypeMutation,
  useUpdateTicketTypeMutation,
  useGetEventSalesQuery,
  useGetEventAnalyticsQuery,
  useScanTicketMutation,
  useUploadEventImageMutation,
} = hostApi;