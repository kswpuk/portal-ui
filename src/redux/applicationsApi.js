import { portalApi } from './portalApi'

const applicationsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listApplications: builder.query({
      query: () => 'applications',
      providesTags: ['APPLICATIONS'],
    }),
    getApplication: builder.query({
      query: (membershipNumber) => `applications/${membershipNumber}`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}],
    }),
    getApplicationHead: builder.query({
      query: (membershipNumber) => `applications/${membershipNumber}/head`
    }),
    listReferences: builder.query({
      query: (membershipNumber) => `applications/${membershipNumber}/references`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'REFERENCES', id: membershipNumber}],
    }),
    getReference: builder.query({
      query: ({membershipNumber, referenceEmail}) => `applications/${membershipNumber}/references/${referenceEmail}`,
      providesTags: (_result, _error, {membershipNumber, referenceEmail}) => [{type: 'REFERENCE', id: membershipNumber + "/" + referenceEmail}],
    }),
    acceptReference: builder.mutation({
      query: ( {membershipNumber, referenceEmail, accept} ) => ({
        url: `applications/${membershipNumber}/references/${referenceEmail}/accept`,
        method: 'PATCH',
        body: {accepted: accept}
      }),
      invalidatesTags: (_result, _error, {membershipNumber, referenceEmail}) => [{type: 'REFERENCES', id: membershipNumber}, {type: 'REFERENCE', id: membershipNumber + "/" + referenceEmail}, 'APPLICATIONS'],
    }),
    deleteApplication: builder.mutation({
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}, 'APPLICATIONS'],
    }),
    approveApplication: builder.mutation({
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}/approve`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}, 'APPLICATIONS', 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    submitApplication: builder.mutation({
      query: ({membershipNumber, ...application}) => ({
        url: `applications/${membershipNumber}`,
        method: 'POST',
        body: application,
      }),
      invalidatesTags: ['APPLICATIONS'],
    }),
    submitReference: builder.mutation({
      query: ( {membershipNumber, reference} ) => ({
        url: `applications/${membershipNumber}/references`,
        method: 'POST',
        body: reference,
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'REFERENCES', id: membershipNumber}],
    }),
    getStatus: builder.query({
      query: ({membershipNumber, dateOfBirth}) => ({
        url: `applications/${membershipNumber}/status`,
        method: 'POST',
        body: {dateOfBirth}
      })
    })
  }),
  overrideExisting: false,
})

export const { useListApplicationsQuery, useGetApplicationQuery, useGetApplicationHeadQuery, useListReferencesQuery, useGetReferenceQuery, useAcceptReferenceMutation, useDeleteApplicationMutation, useApproveApplicationMutation,
  useSubmitApplicationMutation, useSubmitReferenceMutation, useGetStatusQuery } = applicationsApi
