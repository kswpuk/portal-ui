import { useDispatch } from 'react-redux'
import ChangePhoto from '../members/ChangePhoto'
import { selectPhoto, setTitle } from '../redux/navSlice'

export default function UserPhoto() {
  const dispatch = useDispatch()

  dispatch(setTitle("My Photo"))
  dispatch(selectPhoto())

  return <ChangePhoto membershipNumber="404754" />
}