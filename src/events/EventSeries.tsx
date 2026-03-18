import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Card, CardActionArea, CardActions, CardContent, Fab, Grid, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useDeleteEventSeriesMutation, useListEventSeriesQuery } from "../redux/eventsApi"
import { setTitle } from "../redux/navSlice"
import Privileged from '../common/Privileged'
import { Add, ArrowDropDownRounded, Celebration, Delete, Edit, EventBusy } from '@mui/icons-material'
import AddEventSeriesDialog from "./AddEventSeriesDialog"
import EditEventSeriesDialog from "./EditEventSeriesDialog"
import ConfirmButton from "../common/ConfirmButton"
import LocationWidget from "./LocationWidget"
import DateRangeWidget from "../common/DateRangeWidget"
import { Link } from "react-router-dom"
import EventSeriesAttendanceWrapper from "./EventSeriesAttendanceWrapper"

export default function EventSeries() {
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const [editEventSeries, setEditEventSeries] = useState<EventSeriesListItem | null>(null)

  const {data: eventSeries, isLoading, error} = useListEventSeriesQuery(true)
  const [ deleteEventSeries, { isLoading: isDeleting } ] = useDeleteEventSeriesMutation()

  useEffect(() => {
    dispatch(setTitle("Event Series"))
  }, [dispatch])

  if(isLoading || eventSeries === undefined){
    return <Loading />
  }else if(error){
    return <Error error={error}>Unable to load event series</Error>
  }

  const eventTypeIcon = (type: EventType) => {
    if (type === "social"){
      return <Tooltip title="This is a social event">
        <Celebration fontSize="small" sx={{ml: '0.5rem', verticalAlign: 'middle'}} color="primary" />
      </Tooltip>
    } else if (type === "no_impact") {
      return <Tooltip title="This is event has no impact on allocations">
        <EventBusy fontSize="small" sx={{ml: '0.5rem', verticalAlign: 'middle'}} color="primary" />
      </Tooltip>
    } else {
      return null
    }
  }

  let stack = [];
  let currLetter = null;
  for (let e of eventSeries) {
    let letter = e.name.substring(0, 1).toUpperCase();

    if(letter != currLetter) {
      stack.push(<Box key={"letter_"+letter} marginTop={currLetter == null ? "0rem" : "1.5rem"} marginBottom="1rem">
        <Typography variant="h5">{letter}</Typography>
      </Box>);

      currLetter = letter;
    }

    stack.push(<Accordion key={e.eventSeriesId}>
        <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
          <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
            <Typography variant="h5" flex={1}>
              {e.name}
              {eventTypeIcon(e.type)}
            </Typography>
            <Typography variant="subtitle1" marginRight="1rem" color="grey">{e["instances"].length} instance{e["instances"].length != 1 ? "s" : ""}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {e.description}
          <Grid container spacing={2} sx={{mt: 1}}>
            {e["instances"].map(i => <Grid key={i.eventId} size={{xs: 6, md: 4, lg: 3}}>
              <Card variant="outlined">
                <CardActionArea sx={{p: 1, pt: '1rem'}} component={Link} to={`/events/${i["eventSeriesId"]}/${i["eventId"]}`}>
                  <DateRangeWidget startDate={i.startDate} endDate={i.endDate} marginBottom='0.5rem' />
                  <LocationWidget event={i} marginBottom='0.5rem' />
                </CardActionArea>
              </Card>
            </Grid>)}
          </Grid>
          <Box marginTop="1rem">
            <EventSeriesAttendanceWrapper eventSeriesId={e.eventSeriesId} />
          </Box>
        </AccordionDetails>
        <Privileged allowed={["EVENTS"]}>
          <AccordionActions>
            <Button startIcon={<Edit />} onClick={() => setEditEventSeries(e)}>Edit</Button>
            {e["instances"].length === 0 ? <ConfirmButton startIcon={<Delete />} onConfirm={() => deleteEventSeries(e["eventSeriesId"])}
                loading={isDeleting} loadingText="Deleting..."
                body={"Are you sure you want to delete the event series "+e['name']+"? This action cannot be undone."}>Delete</ConfirmButton> : null}
          </AccordionActions>
        </Privileged>
      </Accordion>)
  }

  return <>
    <Box marginBottom="5rem">
      {stack}
    </Box>
    <Privileged allowed={["EVENTS"]}>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => setShow(true)}>
        <Add />
      </Fab>

      <AddEventSeriesDialog show={show} onClose={() => setShow(false)} existing={eventSeries.map(e => e.eventSeriesId)}/>
      <EditEventSeriesDialog show={editEventSeries !== null} onClose={() => setEditEventSeries(null)} event={editEventSeries} />
    </Privileged>
  </>
}