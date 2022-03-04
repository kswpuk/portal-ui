import { portalApi } from './portalApi'

const applicationsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listApplications: builder.query({
      providesTags: ['APPLICATIONS'],
      query: () => 'applications'
    }),
    getApplication: builder.query({
      providesTags: ['APPLICATION'],
      query: (membershipNumber) => `applications/${membershipNumber}`
    }),
    getApplicationHead: builder.query({
      query: (membershipNumber) => `applications/${membershipNumber}/head`
    }),
    listReferences: builder.query({
      providesTags: ['REFERENCES'],
      query: (membershipNumber) => `applications/${membershipNumber}/references`
    }),
    // TODO: Also delete references at same time - second API call, or Lambda triggered from DynamoDB Stream?
    deleteApplication: builder.mutation({
      invalidatesTags: ['APPLICATION', 'APPLICATIONS'],
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}`,
        method: 'DELETE'
      }),
    }),
    approveApplication: builder.mutation({
      invalidatesTags: ['APPLICATION', 'APPLICATIONS'],
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}/approve`,
        method: 'POST'
      }),
    }),
    submitApplication: builder.mutation({
      invalidatesTags: ['APPLICATIONS'],
      query: ({membershipNumber, ...application}) => ({
        url: `applications/${membershipNumber}`,
        method: 'POST',
        body: application,
      }),
    }),
    submitReference: builder.mutation({
      invalidatesTags: ['REFERENCES'],
      query: ( {membershipNumber, reference} ) => ({
        url: `applications/${membershipNumber}/references`,
        method: 'POST',
        body: reference,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useListApplicationsQuery, useGetApplicationQuery, useGetApplicationHeadQuery, useListReferencesQuery, useDeleteApplicationMutation, useApproveApplicationMutation, useSubmitApplicationMutation, useSubmitReferenceMutation } = applicationsApi
