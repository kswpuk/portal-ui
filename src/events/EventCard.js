import { Event } from "@mui/icons-material"
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material"
import moment from "moment"
import IconText from "../common/IconText"
import AllocationWidget from "./AllocationWidget"
import LocationWidget from "./LocationWidget"

export default function EventCard(props){
  let date = null
  const startDate = new moment(props.event.startDate)
  const endDate = new moment(props.event.endDate)
  
  const registrationDate = new moment(props.event.registrationDate)
  const now = new moment()

  const registrationClosed = registrationDate.isBefore(now, 'day');

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

  return <Card className={!props.hideAllocation ? "allocation_"+props.event.allocation : ""} elevation={registrationClosed || props.flat ? 1 : 6}>
    {props.title ? <CardHeader title={props.title} /> : null}
    <CardContent>
      <Typography variant='h6' sx={{marginBottom: '1rem'}}>{props.event.name}</Typography>
      
      <IconText icon={<Event />} marginBottom='0.5rem'>
        {date}
      </IconText>

      <LocationWidget event={props.event} marginBottom={!props.hideAllocation ? '0.5rem' : '1rem'} />
      {!props.hideAllocation ? <AllocationWidget allocation={props.event.allocation} closed={registrationClosed} /> : null }

      <Typography variant="body2">{props.event.description}</Typography>
    </CardContent>
    <CardActions>
      <Button href={"/events/" + props.event.eventSeriesId + "/" + props.event.eventId}>View Details</Button>
    </CardActions>
  </Card>
}