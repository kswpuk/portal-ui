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
    updateMember: builder.mutation({
      query: ({ membershipNumber, ...body }) => ({
        url: `members/${membershipNumber}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (_result, _error, {membershipNumber}) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS'],
    }),
    deleteMember: builder.mutation({
      query: ( membershipNumber ) => ({
        url: `members/${membershipNumber}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, membershipNumber) => [{type: 'MEMBER', id: membershipNumber}, 'MEMBERS'],
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
  }),
  overrideExisting: false,
})

export const { useListMembersQuery, useGetMemberQuery, useGetMemberAllocationsQuery, useUpdateMemberMutation, useDeleteMemberMutation, usePayMembershipMutation, useChangePhotoMutation } = membersApi
