import { useDispatch } from 'react-redux'
import { selectPhoto, setTitle } from '../redux/navSlice'

export default function UserPhoto() {
  const dispatch = useDispatch()

  dispatch(setTitle("My Photo"))
  dispatch(selectPhoto())

  return <p>My Photo</p>
}