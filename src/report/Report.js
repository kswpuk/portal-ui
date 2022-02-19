import { useDispatch } from 'react-redux'
import { selectReport, setTitle } from '../redux/navSlice'

export default function Report() {
  const dispatch = useDispatch()

  dispatch(setTitle("Report"))
  dispatch(selectReport())

  return <p>Report</p>
}