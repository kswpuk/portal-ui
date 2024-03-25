import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material"
import moment from "moment"
import DateRangeWidget from "../common/DateRangeWidget"
import AllocationWidget from "./AllocationWidget"
import LocationWidget from "./LocationWidget"

export default function EventCard(props){
  const registrationDate = new moment(props.event.registrationDate)
  const now = new moment()

  const registrationClosed = registrationDate.isBefore(now, 'day');


  return <Card className={!props.hideAllocation ? "allocation_"+props.event.allocation : ""} elevation={registrationClosed || props.flat ? 1 : 6}>
    {props.title ? <CardHeader title={props.title} /> : null}
    <CardContent>
      <Typography variant='h6' sx={{marginBottom: '1rem'}}>{props.event.name}</Typography>
      
      <DateRangeWidget startDate={props.event.startDate} endDate={props.event.endDate} marginBottom='0.5rem' />

      <LocationWidget event={props.event} marginBottom={!props.hideAllocation ? '0.5rem' : '1rem'} />
      {!props.hideAllocation ? <AllocationWidget allocation={props.event.allocation} closed={registrationClosed} /> : null }

      <Typography variant="body2">{props.event.description}</Typography>
    </CardContent>
    <CardActions>
      <Button href={"/events/" + props.event.eventSeriesId + "/" + props.event.eventId}>View Details</Button>
    </CardActions>
  </Card>
}