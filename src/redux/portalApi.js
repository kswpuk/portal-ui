import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { baseUrl } from '../consts';

export const data = (data) => ({data: data})
export const error = (message) => ({error: {message: message}})

export const portalApi = createApi({
  reducerPath: 'portalApi',
  tagTypes: [
    'APPLICATIONS', 'APPLICATION', 'REFERENCES', 'REFERENCE', 'APPLICATIONS_REPORT',
    'MEMBERS', 'MEMBER', 'MEMBER_ALLOCATIONS', 'MEMBER_PHOTO', 'MEMBERS_COMPARE', 'MEMBERS_EXPORT', 'MEMBERS_REPORT', 'MEMBERS_AWARDS',
    'EVENTS', 'EVENT', 'ALL_EVENT_SERIES', 'EVENT_SERIES', 'ALLOCATION_SUGGESTION', 'EVENTS_REPORT', 'EVENTS_ATTENDANCE_REPORT'
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: async (headers) => {
      try{
        const session = (await fetchAuthSession());
        const token = session.tokens?.accessToken.toString()
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }catch(error){
        // Do nothing
        console.error(error)
      }finally{
        return headers
      }
    }
  }),
  endpoints: () => ({}),
})