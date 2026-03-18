import { portalApi } from './portalApi'

const eventsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query<EventListItem[], boolean>({
      query: (allResults) => allResults ? 'events?all=true' : 'events',
      providesTags: ['EVENTS'], // TODO: This should reference allResults?
    }),
    getEvent: builder.query<EventDetails, {eventSeriesId: string, eventId: string}>({
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}`,
      providesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}],
    }),
    createEvent: builder.mutation<void, {eventSeriesId: string, eventId: string, body: EventBody, social?: boolean}>({
      query: ( { eventSeriesId, eventId, body, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['EVENTS'],
    }),
    editEvent: builder.mutation<void, {eventSeriesId: string, eventId: string, body: EventBody, social?: boolean}>({
      query: ( { eventSeriesId, eventId, body, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}],
    }),
    deleteEvent: builder.mutation<{}, {eventSeriesId: string, eventId: string, social: boolean}>({
      query: ( { eventSeriesId, eventId, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    registerForEvent: builder.mutation({ // TODO: Add type
      query: ({ eventSeriesId, eventId, membershipNumber }) => ({
        url: `events/${eventSeriesId}/${eventId}/register/${membershipNumber}`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}, 'MEMBERS_EXPORT', {type: 'EVENT_SERIES_ALLOCATIONS', id: eventSeriesId}],
    }),
    suggestAllocations: builder.query({ // TODO: Add type
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}/allocate/suggest`,
      providesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}],
    }),
    allocateToEvent: builder.mutation<{}, {eventSeriesId: string, eventId: string, allocations: [{allocation: AllocationStatus, membershipNumbers: string[]}], social: boolean}>({
      query: ({ eventSeriesId, eventId, allocations, social }) => ({
        url: `${social ? 'socials' : 'events'}/${eventSeriesId}/${eventId}/allocate`,
        method: 'PUT',
        body: {
          "allocations": allocations
        }
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS', {type: 'ALLOCATION_SUGGESTION', id: `${eventSeriesId}/${eventId}`}, 'MEMBERS_EXPORT', {type: 'EVENT_SERIES_ALLOCATIONS', id: eventSeriesId}],
    }),
    listEventSeries: builder.query<EventSeriesListItem[] | EventSeriesDetailedListItem[], boolean>({
      query: (detailed) => detailed ? `events/_series?detailed=true` : `events/_series`,
      providesTags: ['ALL_EVENT_SERIES'],
    }),
    getEventSeries: builder.query({ // TODO: Add type
      query: (eventSeriesId) => `events/${eventSeriesId}`,
      providesTags: (_result, _error, eventSeriesId) => [{type: 'EVENT_SERIES', id: eventSeriesId}],
    }),
    createEventSeries: builder.mutation<{}, {eventSeriesId: string, body: {name: string, description: string, type: EventType}}>({
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    editEventSeries: builder.mutation({ // TODO: Add type
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    deleteEventSeries: builder.mutation({ // TODO: Add type
      query: ( eventSeriesId ) => ({
        url: `events/${eventSeriesId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    }),
    getEventSeriesAllocations: builder.query<EventAllocationBase[], string>({
      query: (eventSeriesId) => `events/${eventSeriesId}/_allocations`,
      providesTags: (_result, _error, eventSeriesId) => [{type: 'EVENT_SERIES_ALLOCATIONS', id: eventSeriesId}],
    }),
    eventsReport: builder.query<EventsReport, void>({
      query: () => 'events/report',
      providesTags: ['EVENTS_REPORT'],
    }),
    eventsAttendanceReport: builder.query<EventAttendanceReport, void>({
      query: () => 'events/report/attendance',
      providesTags: ['EVENTS_ATTENDANCE_REPORT'],
    }),
  }),
  overrideExisting: false,
})

// Export ListEventSeries manually, as it returns different things depending on the value of detailed
const useListEventSeriesQueryBase = eventsApi.endpoints.listEventSeries.useQuery;
export function useListEventSeriesQuery(detailed: false): Omit<ReturnType<typeof useListEventSeriesQueryBase>, "data"> & { data?: EventSeriesListItem[] };
export function useListEventSeriesQuery(detailed: true): Omit<ReturnType<typeof useListEventSeriesQueryBase>, "data"> & { data?: EventSeriesDetailedListItem[] };

export function useListEventSeriesQuery(detailed: boolean): ReturnType<typeof useListEventSeriesQueryBase> {
  return useListEventSeriesQueryBase(detailed);
}

export const { useListEventsQuery, useGetEventQuery, useCreateEventMutation, useEditEventMutation, useDeleteEventMutation,
  useRegisterForEventMutation, useSuggestAllocationsQuery, useAllocateToEventMutation,
  useGetEventSeriesQuery, useCreateEventSeriesMutation, useEditEventSeriesMutation, useDeleteEventSeriesMutation,
  useGetEventSeriesAllocationsQuery,
  useEventsReportQuery, useEventsAttendanceReportQuery
} = eventsApi
