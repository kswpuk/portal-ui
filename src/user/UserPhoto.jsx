import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Loading from '../common/Loading'
import ChangePhoto from '../members/ChangePhoto'
import { selectPhoto, setTitle } from '../redux/navSlice'

export default function UserPhoto() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTitle("My Photo"))
    dispatch(selectPhoto())
  }, [])

  const [membershipNumber, setMembershipNumber] = useState(null);
  getCurrentUser().then(user => setMembershipNumber(user.username));

  if (membershipNumber === null){
    return <Loading />
  }else{
    return <ChangePhoto membershipNumber={membershipNumber} />
  }
}