
import { Button } from "@mui/material"
import { useState } from "react"
import EventSeriesAttendance from "./EventSeriesAttendance";

export default function EventSeriesAttendanceWrapper({eventSeriesId}: {eventSeriesId: string}) {
  const [show, setShow] = useState(false);
  
  if(show) {
    return <EventSeriesAttendance eventSeriesId={eventSeriesId} />
  } else {
    return <Button variant="outlined" onClick={() => setShow(true)}>Load Event Allocations</Button>
  }
}