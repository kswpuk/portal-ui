import { portalApi } from './portalApi'

const membersApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listMembers: builder.query({
      providesTags: ['MEMBERS'],
      query: () => 'members'
    }),
    getMember: builder.query({
      providesTags: ['MEMBER'],
      query: (membershipNumber) => `members/${membershipNumber}`
    }),
    updateMember: builder.mutation({
      invalidatesTags: ['MEMBER', 'MEMBERS'],
      query: ({ membershipNumber, ...body }) => ({
        url: `members/${membershipNumber}`,
        method: 'PUT',
        body: body,
      }),
    }),
    deleteMember: builder.mutation({
      invalidatesTags: ['MEMBER', 'MEMBERS'],
      query: ( membershipNumber ) => ({
        url: `members/${membershipNumber}`,
        method: 'DELETE'
      }),
    })
  }),
  overrideExisting: false,
})

export const { useListMembersQuery, useGetMemberQuery, useUpdateMemberMutation, useDeleteMemberMutation } = membersApi