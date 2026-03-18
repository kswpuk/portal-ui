import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import Loading from '../common/Loading'
import EditMember from '../members/EditMember'
import { selectUser, setTitle } from '../redux/navSlice'
import { useAppDispatch } from '../redux/hooks'

export default function User() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTitle("My Details"))
    dispatch(selectUser())
  }, [])

  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => setMembershipNumber(user.username));
  }, []);
  

  if (membershipNumber === null){
    return <Loading />
  }else{
    return <EditMember membershipNumber={membershipNumber} />
  }
}