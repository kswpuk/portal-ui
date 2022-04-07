import { portalApi } from './portalApi'

const eventsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      providesTags: ['EVENTS'],
      query: (allResults) => allResults ? 'events?all=true' : 'events'
    }),
    getEvent: builder.query({
      providesTags: ['EVENT'],
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}`
    }),
    createEvent: builder.mutation({
      invalidatesTags: ['EVENTS'],
      query: ( { eventSeriesId, eventId, body }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'POST',
        body: body
      })
    }),
    editEvent: builder.mutation({
      invalidatesTags: ['EVENTS', 'EVENT'],
      query: ( { eventSeriesId, eventId, body }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'PUT',
        body: body
      })
    }),
    deleteEvent: builder.mutation({
      invalidatesTags: ['EVENTS', 'EVENT'],
      query: ( { eventSeriesId, eventId }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'DELETE'
      })
    }),
    registerForEvent: builder.mutation({
      invalidatesTags: ['EVENT', 'EVENTS'],
      query: ({ eventSeriesId, eventId, membershipNumber }) => ({
        url: `events/${eventSeriesId}/${eventId}/register/${membershipNumber}`,
        method: 'POST'
      }),
    }),
    allocateToEvent: builder.mutation({
      invalidatesTags: ['EVENT', 'EVENTS'],
      query: ({ eventSeriesId, eventId, allocations }) => ({
        url: `events/${eventSeriesId}/${eventId}/allocate`,
        method: 'PUT',
        body: {
          "allocations": allocations
        }
      }),
    }),
    listEventSeries: builder.query({
      providesTags: ['EVENT_SERIES'],
      query: () => `events/_series`
    }),
    getEventSeries: builder.query({
      query: (eventSeriesId) => `events/${eventSeriesId}`
    }),
    createEventSeries: builder.mutation({
      invalidatesTags: ['EVENT_SERIES'],
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'POST',
        body: body
      })
    })
  }),
  overrideExisting: false,
})

export const { useListEventsQuery, useGetEventQuery, useCreateEventMutation, useEditEventMutation, useDeleteEventMutation, useRegisterForEventMutation, useAllocateToEventMutation, useListEventSeriesQuery, useGetEventSeriesQuery, useCreateEventSeriesMutation } = eventsApi
