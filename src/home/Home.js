import { useDispatch } from 'react-redux'
import { selectHome, setTitle } from '../redux/navSlice'

export default function Home() {
  const dispatch = useDispatch()

  dispatch(setTitle(null))
  dispatch(selectHome())

  return <p>Welcome to the QSWP Portal</p>
}