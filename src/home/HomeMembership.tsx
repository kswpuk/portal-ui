import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from "react";
import Error from "../common/Error";
import Loading from "../common/Loading";
import { useGetMemberQuery } from "../redux/membersApi";
import HomeMembershipDetails from "./HomeMembershipDetails";
import HomeMembershipPayment from "./HomeMembershipPayment";
import HomeMembershipSuspended from './HomeMembershipSuspended';

export default function HomeMembership() {
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => setMembershipNumber(user.username));
  }, []);

  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber || "", {skip: membershipNumber === null})

  if (isLoading || !member) {
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={refetch} />
  }

  return <>
    {member.suspended ? <HomeMembershipSuspended /> : null}
    <HomeMembershipDetails member={member} />
    <HomeMembershipPayment member={member} />
  </>
}