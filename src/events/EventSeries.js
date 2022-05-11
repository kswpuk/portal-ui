import { Button, Card, CardActions, CardContent, Fab, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useListEventSeriesQuery } from "../redux/eventsApi"
import { setTitle } from "../redux/navSlice"
import Privileged from '../common/Privileged'
import { Add, Edit } from '@mui/icons-material'
import AddEventSeriesDialog from "./AddEventSeriesDialog"
import EditEventSeriesDialog from "./EditEventSeriesDialog"

export default function EventSeries() {
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const [editEvent, setEditEvent] = useState(null)

  const {data: eventSeries, isLoading, error} = useListEventSeriesQuery()

  //TODO: Add delete series functionality? Only allow if there are no events?
  //TODO: Display stats for each event series
  //TODO: Link to page

  let sortedEvents = []
  if(eventSeries){
    sortedEvents = [...eventSeries]
    sortedEvents.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  }

  useEffect(() => {
    dispatch(setTitle("Event Series"))
  }, [dispatch])

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error}>Unable to load event series</Error>
  }

  return <>
    {/* Add some text here describing what an Event Series is, and what it's used for */}

    <Grid container spacing={2} sx={{marginBottom: '1rem'}}>
      {sortedEvents.map(e => <Grid item xs={12} key={e.eventSeriesId}>
        <Card>
          <CardContent>
            <Typography variant="h6">{e.name}</Typography>
            <Typography variant="body2">{e.description}</Typography>
          </CardContent>
          <Privileged allowed={["EVENTS"]}>
            <CardActions>
              <Button startIcon={<Edit />} onClick={() => setEditEvent(e)}>Edit</Button>
            </CardActions>
          </Privileged>
        </Card>
      </Grid>)}
    </Grid>

    <Privileged allowed={["EVENTS"]}>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => setShow(true)}>
        <Add />
      </Fab>

      <AddEventSeriesDialog show={show} onClose={() => setShow(false)} existing={eventSeries.map(e => e.eventSeriesId)}/>
      <EditEventSeriesDialog show={editEvent !== null} onClose={() => setEditEvent(null)} event={editEvent} />
    </Privileged>
  </>
}