import { portalApi } from './portalApi'

const eventsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      query: (allResults) => allResults ? 'events?all=true' : 'events',
      providesTags: ['EVENTS'],
    }),
    getEvent: builder.query({
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}`,
      providesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}],
    }),
    createEvent: builder.mutation({
      query: ( { eventSeriesId, eventId, body, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['EVENTS'],
    }),
    editEvent: builder.mutation({
      query: ( { eventSeriesId, eventId, body, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}],
    }),
    deleteEvent: builder.mutation({
      query: ( { eventSeriesId, eventId, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    registerForEvent: builder.mutation({
      query: ({ eventSeriesId, eventId, membershipNumber }) => ({
        url: `events/${eventSeriesId}/${eventId}/register/${membershipNumber}`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}, 'MEMBERS_EXPORT'],
    }),
    suggestAllocations: builder.query({
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}/allocate/suggest`,
      providesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}],
    }),
    allocateToEvent: builder.mutation({
      query: ({ eventSeriesId, eventId, allocations, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}/allocate`,
        method: 'PUT',
        body: {
          "allocations": allocations
        }
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}, 'MEMBERS_EXPORT'],
    }),
    listEventSeries: builder.query({
      query: (detailed) => detailed ? `events/_series?detailed=true` : `events/_series`,
      providesTags: ['ALL_EVENT_SERIES'],
    }),
    getEventSeries: builder.query({
      query: (eventSeriesId) => `events/${eventSeriesId}`,
      providesTags: (_result, _error, eventSeriesId) => [{type: 'EVENT_SERIES', id: eventSeriesId}],
    }),
    createEventSeries: builder.mutation({
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    editEventSeries: builder.mutation({
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    deleteEventSeries: builder.mutation({
      query: ( eventSeriesId ) => ({
        url: `events/${eventSeriesId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    eventsReport: builder.query({
      query: () => 'events/report',
      providesTags: ['EVENTS_REPORT'],
    }),
    eventsAttendanceReport: builder.query({
      query: () => 'events/report/attendance',
      providesTags: ['EVENTS_ATTENDANCE_REPORT'],
    }),
  }),
  overrideExisting: false,
})

export const { useListEventsQuery, useGetEventQuery, useCreateEventMutation, useEditEventMutation, useDeleteEventMutation,
  useRegisterForEventMutation, useSuggestAllocationsQuery, useAllocateToEventMutation,
  useListEventSeriesQuery, useGetEventSeriesQuery, useCreateEventSeriesMutation, useEditEventSeriesMutation, useDeleteEventSeriesMutation,
  useEventsReportQuery, useEventsAttendanceReportQuery
} = eventsApi
