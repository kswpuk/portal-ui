import { useDispatch } from 'react-redux'
import { selectEvents, setTitle } from '../redux/navSlice'

export default function Events() {
  const dispatch = useDispatch()

  dispatch(setTitle("Events"))
  dispatch(selectEvents())

  return <p>Events</p>
}