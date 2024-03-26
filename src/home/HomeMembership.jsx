import { getCurrentUser } from 'aws-amplify/auth'
import { useState } from "react";
import Error from "../common/Error";
import Loading from "../common/Loading";
import { useGetMemberQuery } from "../redux/membersApi";
import HomeMembershipDetails from "./HomeMembershipDetails";
import HomeMembershipPayment from "./HomeMembershipPayment";

export default function HomeMembership(props) {
  const [membershipNumber, setMembershipNumber] = useState(null);
  getCurrentUser().then(user => setMembershipNumber(user.username));

  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber, {skip: membershipNumber === null})

  if (isLoading || !member) {
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={refetch} />
  }

  return <>
    <HomeMembershipDetails member={member} />
    <HomeMembershipPayment member={member} />
  </>
}