import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import Loading from '../common/Loading'
import ChangePhoto from '../members/ChangePhoto'
import { selectPhoto, setTitle } from '../redux/navSlice'
import { useAppDispatch } from '../redux/hooks'

export default function UserPhoto() {
  const dispatch = useAppDispatch()
  const [membershipNumber, setMembershipNumber] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setTitle("My Photo"))
    dispatch(selectPhoto())
  }, [])

  useEffect(() => {
    getCurrentUser().then(user => setMembershipNumber(user.username));
  })


  if (membershipNumber === null){
    return <Loading />
  }else{
    return <ChangePhoto membershipNumber={membershipNumber} />
  }
}