import { useDispatch } from 'react-redux'
import { selectApplications, setTitle } from '../redux/navSlice'

export default function Applications() {
  const dispatch = useDispatch()

  dispatch(setTitle("Applications"))
  dispatch(selectApplications())

  return <p>Applications</p>
}