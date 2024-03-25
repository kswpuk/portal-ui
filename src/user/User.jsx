import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Loading from '../common/Loading'
import EditMember from '../members/EditMember'
import { selectUser, setTitle } from '../redux/navSlice'

export default function User() {
  const dispatch = useDispatch()

  dispatch(setTitle("My Details"))
  dispatch(selectUser())

  const [membershipNumber, setMembershipNumber] = useState(null);
  Auth.currentUserInfo().then(user => setMembershipNumber(user.username));

  if (membershipNumber === null){
    return <Loading />
  }else{
    return <EditMember membershipNumber={membershipNumber} />
  }
}