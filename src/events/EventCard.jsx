import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material"
import DateRangeWidget from "../common/DateRangeWidget"
import AllocationWidget from "./AllocationWidget"
import LocationWidget from "./LocationWidget"
import DeadlineWidget from "../common/DeadlineWidget"

export default function EventCard(props){

  return <Card className={!props.hideAllocation ? "allocation_"+props.event.allocation : ""} elevation={props.flat ? 1 : 6}>
    {props.title ? <CardHeader title={props.title} /> : null}
    <CardContent>
      <Typography variant='h6' sx={{marginBottom: '1rem'}}>{props.event.name}</Typography>
      
      <DateRangeWidget startDate={props.event.startDate} endDate={props.event.endDate} marginBottom='0.5rem' />
      <LocationWidget event={props.event} marginBottom='0.5rem' />
      {!props.hideDeadline ? <DeadlineWidget deadline={props.event.registrationDate} marginBottom='1rem'/> : null }

      {!props.hideAllocation ? <AllocationWidget allocation={props.event.allocation} /> : null }

      <Typography variant="body2">{props.event.description}</Typography>
    </CardContent>
    <CardActions>
      <Button href={"/events/" + props.event.eventSeriesId + "/" + props.event.eventId}>View Details</Button>
    </CardActions>
  </Card>
}