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
    })
  }),
  overrideExisting: false,
})

export const { useListEventsQuery, useGetEventQuery, useRegisterForEventMutation, useAllocateToEventMutation } = eventsApi
