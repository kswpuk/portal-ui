import { useDispatch } from 'react-redux'
import { selectReport, setTitle } from '../redux/navSlice'
import MembersReport from './MembersReport'
import EventsReport from './EventsReport'
import ApplicationsReport from './ApplicationsReport'
import Maps from './Maps'

export default function Report() {
  const dispatch = useDispatch()

  dispatch(setTitle("Report"))
  dispatch(selectReport())

  return <>
    <h1>Events</h1>
    <EventsReport />

    <h1>Membership</h1>
    <MembersReport />

    <h1>Applications</h1>
    <ApplicationsReport />

    <h1>Locations</h1>
    <Maps />
  </>
}