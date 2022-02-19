import { useDispatch } from 'react-redux'
import { selectUser, setTitle } from '../redux/navSlice'

export default function User() {
  const dispatch = useDispatch()

  dispatch(setTitle("My Details"))
  dispatch(selectUser())

  return <p>My Details</p>
}