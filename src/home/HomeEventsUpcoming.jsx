import { Card, CardContent, CardHeader, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment"

export default function HomeEventsUpcoming(props) {
  const toDate = (start, end) => {
    const startDate = new moment(start)
    const endDate = new moment(end)
  
    const endDateFormat = endDate.format("D MMMM YYYY")
    if(startDate.format("D MMMM YYYY") === endDateFormat){
      // Same day
      return startDate.format("D MMMM YYYY")
    }else if(startDate.month() === endDate.month()){
      // Different days, same month
      return startDate.date() + " - "+ endDateFormat
    }else if(startDate.year() === endDate.year()) {
      // Different days, different months, same year
      return endDate.format("D MMMM") + " - "+ endDateFormat
    }else{
      // Different days, different months, different years
      return endDate.format("D MMMM YYYY") + " - "+ endDateFormat
    }
  }

  return <Card>
    <CardHeader title="Upcoming Events" />
    <CardContent>
      <List>
        {props.events.length === 0 ? <ListItem><ListItemText>There are currently no upcoming events</ListItemText></ListItem>  : null}
        {props.events.slice(0, 5).map(e => {
          return <ListItem key={e.eventId} className={"allocation_"+e.allocation} disablePadding>
            <ListItemButton component={Link} to={"/events/"+e.eventSeriesId+"/"+e.eventId}>
              <ListItemText primary={e.name} secondary={<>
                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                {toDate(e.startDate, e.endDate)}  
                </Typography>
                <br />
                {e.locationType === "virtual" ? "Online" : e.location}
                
              </>} />
            </ListItemButton>
          </ListItem>
        })}
      </List>
    </CardContent>
  </Card>
}