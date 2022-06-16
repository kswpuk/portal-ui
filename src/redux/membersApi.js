import { portalApi } from './portalApi'

const membersApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listMembers: builder.query({
      query: () => 'members',
      providesTags: ['MEMBERS'],
    }),
    getMember: builder.query({
      query: (membershipNumber) => `members/${membershipNumber}`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER', id: membershipNumber}],
    }),
    getMemberAllocations: builder.query({
      query: (membershipNumber) => `members/${membershipNumber}/allocations`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER_ALLOCATIONS', id: membershipNumber}],
    }),
    getMemberPhoto: builder.query({
      query: (membershipNumber) => `members/${membershipNumber}/photo`,
      providesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER_PHOTO', id: membershipNumber}],
      transformResponse: (result, _meta, _membershipNumber) => result.url
    }),
    updateMember: builder.mutation({
      query: ({ membershipNumber, ...body }) => ({
        url: `members/${membershipNumber}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    deleteMember: builder.mutation({
      query: ( membershipNumber ) => ({
        url: `members/${membershipNumber}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS', 'MEMBERS_COMPARE'],
    }),
    payMembership: builder.mutation({
      query: (membershipNumber) => ({
        url: `members/${membershipNumber}/payment`,
        method: 'POST'
      }),
      // Doesn't invalidate tags because this endpoint just creates a Stripe session
    }),
    changePhoto: builder.mutation({
      query: ({membershipNumber, photo}) => ({
        url: `members/${membershipNumber}/photo`,
        method: 'PUT',
        body: photo,
      }),
      // Doesn't invalidate tags because we don't cache photos via RTK
    }),
    setNeckerReceived: builder.mutation({
      query: ( {membershipNumber, received} ) => ({
        url: `members/${membershipNumber}/necker`,
        method: 'PATCH',
        body: {receivedNecker: received}
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS'],
    }),
    compare: builder.query({
      query: ( membershipNumbers ) => ({
        url: `members/compare`,
        method: 'POST',
        body: {members: membershipNumbers}
      }),
      providesTags: ['MEMBERS_COMPARE'],
    }),
    export: builder.query({
      query: ( {members, event} ) => ({
        url: `members/export`,
        method: 'POST',
        body: {members, combinedEventId: event},
        responseHandler: "text"
      }),
      providesTags: ['MEMBERS_EXPORT'],
    })
  }),
  overrideExisting: false,
})

export const { useListMembersQuery, useGetMemberQuery, useGetMemberAllocationsQuery, useGetMemberPhotoQuery, useUpdateMemberMutation, useDeleteMemberMutation,
  usePayMembershipMutation, useChangePhotoMutation, useSetNeckerReceivedMutation, useCompareQuery, useExportQuery } = membersApi
