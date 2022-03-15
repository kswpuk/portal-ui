import { Computer, Event, LocationOn, Person, PersonOutline } from "@mui/icons-material"
import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material"
import moment from "moment"
import { ALLOCATED, ALLOCATION_COLOURS, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts"

export default function EventCard(props){
  let allocationText = null

  switch(props.event.allocation){
    case REGISTERED:
      allocationText = "Registered"
      break
    case ALLOCATED:
      allocationText = "Allocated"
      break
    case ATTENDED:
      allocationText = "Attended"
      break
    case NOT_ALLOCATED:
      allocationText = "Not allocated"
      break
    case RESERVE:
      allocationText = "Reserve list"
      break
    case DROPPED_OUT:
      allocationText = "Dropped out"
      break
    case NO_SHOW:
      allocationText = "Did not attend"
      break
    default:
      allocationText = null
  }

  let date = null
  const startDate = new moment(props.event.startDate)
  const endDate = new moment(props.event.endDate)

  const endDateFormat = endDate.format("D MMMM YYYY")
  if(startDate.format("D MMMM YYYY") === endDateFormat){
    // Same day
    date = startDate.format("D MMMM YYYY")
  }else if(startDate.month() === endDate.month()){
    // Different days, same month
    date = startDate.date() + " - "+ endDateFormat
  }else if(startDate.year() === endDate.year()) {
    // Different days, different months, same year
    date = endDate.format("D MMMM") + " - "+ endDateFormat
  }else{
    // Different days, different months, different years
    date = endDate.format("D MMMM YYYY") + " - "+ endDateFormat
  }

  let location = null
  switch(props.event.locationType){
    case "virtual":
      location = <>
        <Computer />
        {props.event.location}
      </>
      break
    case "physical":
    default:
      location = <>
        <LocationOn />
        {props.event.location}, {props.event.postcode}
      </>
  }

  return <Card sx={{backgroundColor: ALLOCATION_COLOURS[props.event.allocation]}}>
    <CardContent>
      <Typography variant='h5' sx={{marginBottom: '1rem'}}>{props.event.name}</Typography>
      <Typography component={Stack} direction="row" alignItems="center" gap={2} sx={{marginBottom: '0.5rem'}}>
        <Event />
        {date}
      </Typography>
      <Typography component={Stack} direction="row" alignItems="center" gap={2} sx={{marginBottom: '0.5rem'}}>
        {location}
      </Typography>
      <Typography component={Stack} direction="row" alignItems="center" gap={2} sx={{marginBottom: '1rem'}}>
        {allocationText == null ? <PersonOutline /> : <Person />}
        {allocationText == null ? "Not responded" : allocationText}
      </Typography>
      <Typography variant="body2">{props.event.description}</Typography>
    </CardContent>
    <CardActions>
      <Button href={"/events/" + props.event.combinedEventId}>View Details</Button>
    </CardActions>
  </Card>
}