import { portalApi } from './portalApi'

const applicationsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listApplications: builder.query<ApplicationWithStatus[], void>({
      query: () => 'applications',
      providesTags: ['APPLICATIONS'],
    }),
    getApplication: builder.query<Application, string>({
      query: (membershipNumber) => `applications/${membershipNumber}`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}],
    }),
    getApplicationEvidence: builder.query<string, string>({
      query: (membershipNumber) => `applications/${membershipNumber}/evidence`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION_EVIDENCE', id: membershipNumber}],
      transformResponse: (response: {url: string}) => response.url
    }),
    getApplicationHead: builder.query<ApplicationHead, string>({
      query: (membershipNumber) => `applications/${membershipNumber}/head`
    }),
    listReferences: builder.query<Reference[], string>({
      query: (membershipNumber) => `applications/${membershipNumber}/references`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'REFERENCES', id: membershipNumber}],
    }),
    getReference: builder.query<ReferenceDetail, {membershipNumber: string, referenceEmail: string}>({
      query: ({membershipNumber, referenceEmail}) => `applications/${membershipNumber}/references/${referenceEmail}`,
      providesTags: (_result, _error, {membershipNumber, referenceEmail}) => [{type: 'REFERENCE', id: membershipNumber + "/" + referenceEmail}],
    }),
    acceptReference: builder.mutation<{}, {membershipNumber: string, referenceEmail: string, accept: boolean}>({
      query: ( {membershipNumber, referenceEmail, accept} ) => ({
        url: `applications/${membershipNumber}/references/${referenceEmail}/accept`,
        method: 'PATCH',
        body: {accepted: accept}
      }),
      invalidatesTags: (_result, _error, {membershipNumber, referenceEmail}) => [{type: 'REFERENCES', id: membershipNumber}, {type: 'REFERENCE', id: membershipNumber + "/" + referenceEmail}, 'APPLICATIONS'],
    }),
    deleteApplication: builder.mutation({   // TODO: Define types
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}, 'APPLICATIONS'],
    }),
    approveApplication: builder.mutation({   // TODO: Define types
      query: ( membershipNumber ) => ({
        url: `applications/${membershipNumber}/approve`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'APPLICATION', id: membershipNumber}, 'APPLICATIONS', 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    submitApplication: builder.mutation({   // TODO: Define types
      query: ({membershipNumber, ...application}) => ({
        url: `applications/${membershipNumber}`,
        method: 'POST',
        body: application,
      }),
      invalidatesTags: ['APPLICATIONS'],
    }),
    submitReference: builder.mutation({   // TODO: Define types
      query: ( {membershipNumber, reference} ) => ({
        url: `applications/${membershipNumber}/references`,
        method: 'POST',
        body: reference,
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'REFERENCES', id: membershipNumber}],
    }),
    getStatus: builder.query<ApplicationStatus, {membershipNumber: string, dateOfBirth: string}>({
      query: ({membershipNumber, dateOfBirth}) => ({
        url: `applications/${membershipNumber}/status`,
        method: 'POST',
        body: {dateOfBirth}
      })
    }),
    applicationsReport: builder.query<ApplicationsReport, void>({
      query: () => 'applications/report',
      providesTags: ['APPLICATIONS_REPORT'],
    }),
  }),
  overrideExisting: false,
})

export const { useListApplicationsQuery, useGetApplicationQuery, useGetApplicationEvidenceQuery, useGetApplicationHeadQuery, useListReferencesQuery, useGetReferenceQuery, useAcceptReferenceMutation, useDeleteApplicationMutation, useApproveApplicationMutation,
  useSubmitApplicationMutation, useSubmitReferenceMutation, useGetStatusQuery, useApplicationsReportQuery } = applicationsApi
