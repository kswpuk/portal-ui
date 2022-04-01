import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { selectEvents } from '../redux/navSlice'
import ListEvents from './ListEvents'
import NewEvent from './NewEvent'
import ViewEvent from './ViewEvent'

export default function Events() {
  const dispatch = useDispatch()
  dispatch(selectEvents())

  return <>
    <Routes>
      <Route path=":eventSeriesId/:eventId" element={<ViewEvent />} />
      <Route path="new" element={<NewEvent />} />
      <Route path="/" element={<ListEvents />} />
    </Routes>
  </>
}