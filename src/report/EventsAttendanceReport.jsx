import { Card, CardContent, Grid, Typography } from "@mui/material"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useEventsAttendanceReportQuery } from "../redux/eventsApi"

export default function Eventsreport() {
  const { data: report, error, isLoading, refetch } = useEventsAttendanceReportQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the Events Attendance report</Error>
  }

  return <>
    <h3>Event Attendance (Past 12 Months)</h3>
    <Grid container spacing={2}>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Attended 0 events
            </Typography>
            <Typography variant="h4" component="div">
              {report.counts.ATTENDED[0] || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Attended 1 event
            </Typography>
            <Typography variant="h4" component="div">
            {report.counts.ATTENDED[1] || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Attended 2 or more events
            </Typography>
            <Typography variant="h4" component="div">
              {Object.entries(report.counts.ATTENDED).reduce((acc, [k, v]) => acc + (k >= 2 ? v : 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Dropped out of 1 or more event
            </Typography>
            <Typography variant="h4" component="div">
              {Object.entries(report.counts.DROPPED_OUT).reduce((acc, [k, v]) => acc + (k >= 1 ? v : 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              No Show at 1 or more event
            </Typography>
            <Typography variant="h4" component="div">
              {Object.entries(report.counts.NO_SHOW).reduce((acc, [k, v]) => acc + (k >= 1 ? v : 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Reserve List for 1 or more event
            </Typography>
            <Typography variant="h4" component="div">
              {Object.entries(report.counts.RESERVE).reduce((acc, [k, v]) => acc + (k >= 1 ? v : 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </>
}