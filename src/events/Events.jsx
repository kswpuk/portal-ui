import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { selectEvents } from '../redux/navSlice'
import EditEvent from './EditEvent'
import EventSeries from './EventSeries'
import ListEvents from './ListEvents'
import NewEvent from './NewEvent'
import ViewEvent from './ViewEvent'
import { useEffect } from 'react'

export default function Events() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectEvents())
  }, []);

  return <>
    <Routes>
      <Route path=":eventSeriesId/:eventId" element={<ViewEvent />} />
      <Route path=":eventSeriesId/:eventId/edit" element={<EditEvent />} />
      <Route path="new" element={<NewEvent />} />
      <Route path="series" element={<EventSeries />} />
      <Route path="/" element={<ListEvents />} />
    </Routes>
  </>
}