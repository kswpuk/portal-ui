import { portalApi } from './portalApi'

type MembershipNumberInput = {
  membershipNumber: string
}

type UrlResponse = {
  url: string
}

const membersApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listMembers: builder.query<MemberListItem[], void>({
      query: () => 'members',
      providesTags: ['MEMBERS'],
    }),
    getMember: builder.query<Member, string>({
      query: (membershipNumber) => `members/${membershipNumber}`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER', id: membershipNumber}],
    }),
    getMemberAllocations: builder.query<EventAllocation[], string>({
      query: (membershipNumber) => `members/${membershipNumber}/allocations`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER_ALLOCATIONS', id: membershipNumber}],
    }),
    getMemberPhoto: builder.query<string, string, UrlResponse>({
      query: (membershipNumber) => `members/${membershipNumber}/photo`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER_PHOTO', id: membershipNumber}],
      transformResponse: (result) => result.url
    }),
    updateMember: builder.mutation<void, Member>({
      query: ({ membershipNumber, ...body }) => ({
        url: `members/${membershipNumber}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    deleteMember: builder.mutation<{}, string>({
      query: ( membershipNumber ) => ({
        url: `members/${membershipNumber}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    payMembership: builder.mutation<UrlResponse, string>({
      query: (membershipNumber) => ({
        url: `members/${membershipNumber}/payment`,
        method: 'POST'
      }),
      // Doesn't invalidate tags because this endpoint just creates a Stripe session
    }),
    changePhoto: builder.mutation<{}, MembershipNumberInput & {photo: string | ArrayBuffer | null}>({
      query: ({membershipNumber, photo}) => ({
        url: `members/${membershipNumber}/photo`,
        method: 'PUT',
        body: photo,
      }),
      // Doesn't invalidate tags because we don't cache photos via RTK - TODO: Maybe we now do?
    }),
    setNeckerReceived: builder.mutation<{}, MembershipNumberInput & {received: boolean}>({
      query: ( {membershipNumber, received} ) => ({
        url: `members/${membershipNumber}/necker`,
        method: 'PATCH',
        body: {receivedNecker: received}
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS'],
    }),
    setSuspended: builder.mutation<{}, MembershipNumberInput & {suspended: boolean}>({
      query: ( {membershipNumber, suspended} ) => ({
        url: `members/${membershipNumber}/suspended`,
        method: 'PATCH',
        body: {suspended: suspended}
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS'],
    }),
    compare: builder.query<MemberComparisonResult[], string[]>({
      query: ( membershipNumbers ) => ({
        url: `members/compare`,
        method: 'POST',
        body: {members: membershipNumbers}
      }),
      providesTags: ['MEMBERS_COMPARE'],
    }),
    export: builder.query({ // TODO: Add type
      query: ( {members, event} ) => ({
        url: `members/export`,
        method: 'POST',
        body: {members, combinedEventId: event},
        responseHandler: "text"
      }),
      providesTags: ['MEMBERS_EXPORT'],
    }),
    membersReport: builder.query<MembersReport, void>({
      query: () => 'members/report',
      providesTags: ['MEMBERS_REPORT'],
    }),
    membersAwards: builder.query<{members: MemberName[]}, void>({
      query: () => 'members/awards',
      providesTags: ['MEMBERS_AWARDS'],
    }),
  }),
  overrideExisting: false,
})

export const { useListMembersQuery, useGetMemberQuery, useGetMemberAllocationsQuery, useGetMemberPhotoQuery, useUpdateMemberMutation, useDeleteMemberMutation,
  usePayMembershipMutation, useChangePhotoMutation, useSetNeckerReceivedMutation, useSetSuspendedMutation, useCompareQuery, useExportQuery, useMembersReportQuery, useMembersAwardsQuery } = membersApi
