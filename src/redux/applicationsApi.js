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
      query: (application) => ({
        url: `applications/submit`,
        method: 'POST',
        body: application,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useListApplicationsQuery, useGetApplicationQuery, useListReferencesQuery, useDeleteApplicationMutation, useApproveApplicationMutation, useSubmitApplicationMutation } = applicationsApi
