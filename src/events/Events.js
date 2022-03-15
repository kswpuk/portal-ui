import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { selectEvents } from '../redux/navSlice'
import ListEvents from './ListEvents'

export default function Events() {
  const dispatch = useDispatch()
  dispatch(selectEvents())

  return <>
    <Routes>
      <Route path="/" element={<ListEvents />} />
    </Routes>
  </>
}