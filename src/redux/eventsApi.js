import { portalApi } from './portalApi'

const eventsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      providesTags: ['EVENTS'],
      query: (allResults) => allResults ? 'events?all=true' : 'events'
    }),
  }),
  overrideExisting: false,
})

export const { useListEventsQuery } = eventsApi
