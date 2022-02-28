import { useDispatch } from 'react-redux'
import EditMember from '../members/EditMember'
import { selectUser, setTitle } from '../redux/navSlice'

export default function User() {
  const dispatch = useDispatch()

  dispatch(setTitle("My Details"))
  dispatch(selectUser())

  return <EditMember membershipNumber="404754" />
}