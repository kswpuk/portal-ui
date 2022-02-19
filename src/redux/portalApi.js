import { createApi } from '@reduxjs/toolkit/query/react'
import { Auth } from 'aws-amplify'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { baseUrl } from '../consts';

export const data = (data) => ({data: data})
export const error = (message) => ({error: {message: message}})

export const portalApi = createApi({
  reducerPath: 'portalApi',
  tagTypes: [
    'APPLICATIONS', 'APPLICATION', 'REFERENCES',
    'MEMBERS', 'MEMBER'
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: async (headers) => {
      const token = (await Auth.currentSession()).getAccessToken().getJwtToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: () => ({}),
})