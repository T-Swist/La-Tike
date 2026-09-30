import { baseApi } from '../baseApi';
import type { ApiResponse, Event, HostEvent, ScanResponse } from '../../../types/api';

// Host-specific API endpoints
export const hostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Event management
    createEvent: builder.mutation<Event, Record<string, unknown>>({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      transformResponse: (response: ApiResponse<Event>) => response.data,
      invalidatesTags: ['MyEvents', 'Events'],
    }),

    updateEvent: builder.mutation<Event, { id: string } & Record<string, unknown>>({
      query: ({ id, ...data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Event>) => response.data,
      invalidatesTags: ['MyEvents', 'Events'],
    }),

    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyEvents', 'Events'],
    }),

    // Events hosted by the current user, including sales and check-in stats
    getMyEvents: builder.query<HostEvent[], void>({
      query: () => '/events/my-events',
      transformResponse: (response: ApiResponse<HostEvent[]>) => response.data,
      providesTags: ['MyEvents'],
    }),

    // Ticket scanning
    scanTicket: builder.mutation<ScanResponse, { qrCode: string; eventId?: string; deviceInfo?: string }>({
      query: (data) => ({
        url: '/tickets/scan',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ScanResponse>) => response.data,
      invalidatesTags: ['MyEvents'],
    }),

    // Image upload (multipart/form-data with an "image" field)
    uploadEventImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/events/upload/image',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: ApiResponse<{ url: string }>) => response.data,
    }),
  }),
});

export const {
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetMyEventsQuery,
  useScanTicketMutation,
  useUploadEventImageMutation,
} = hostApi;
