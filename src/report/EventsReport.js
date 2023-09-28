import { Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useEventsReportQuery } from "../redux/eventsApi"
import gradient from 'gradient-color'

export default function EventsReport() {
  const { data: report, error, isLoading, refetch } = useEventsReportQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the Events report</Error>
  }

  const eventMax = Math.max(...Object.values(report.events.counts.startDates))
  const socialMax = Math.max(...Object.values(report.socials.counts.startDates))

  const eventGrad = gradient(["#ffffff", "#a60c2b"], Math.max(eventMax + 1, 2))
  const socialGrad = gradient(["#ffffff", "#fdce72"], Math.max(socialMax + 1, 3))

  const pastEventCell = (date) => {
    const today = new Date()

    const thisMonth = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0")
    return <>
      <TableCell title={`Events: ${report.events.counts.startDates[date] | 0}`} style={{backgroundColor: eventGrad[report.events.counts.startDates[date]], borderLeft: '1px solid'}} align="center">
        {thisMonth === date ? <strong>{report.events.counts.startDates[date] | 0}</strong> : report.events.counts.startDates[date] | 0}
      </TableCell>
      <TableCell title={`Socials: ${report.socials.counts.startDates[date] | 0}`} style={{backgroundColor:socialGrad[report.socials.counts.startDates[date]]}} align="center">
        {thisMonth === date ? <strong>{report.socials.counts.startDates[date] | 0}</strong> : report.socials.counts.startDates[date] | 0}
      </TableCell>
    </>
  }

  const year = new Date().getFullYear()
  const pastEvents = <Table >
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell colSpan={2} align="center">Jan</TableCell>
        <TableCell colSpan={2} align="center">Feb</TableCell>
        <TableCell colSpan={2} align="center">Mar</TableCell>
        <TableCell colSpan={2} align="center">Apr</TableCell>
        <TableCell colSpan={2} align="center">May</TableCell>
        <TableCell colSpan={2} align="center">Jun</TableCell>
        <TableCell colSpan={2} align="center">Jul</TableCell>
        <TableCell colSpan={2} align="center">Aug</TableCell>
        <TableCell colSpan={2} align="center">Sep</TableCell>
        <TableCell colSpan={2} align="center">Oct</TableCell>
        <TableCell colSpan={2} align="center">Nov</TableCell>
        <TableCell colSpan={2} align="center">Dec</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {[...Array(6).keys()].map(i => year - 4 + i).map(yr => <TableRow key={"pastEvents"+yr}>
        <TableCell>{yr}</TableCell>
        {pastEventCell(yr+"-01")}
        {pastEventCell(yr+"-02")}
        {pastEventCell(yr+"-03")}
        {pastEventCell(yr+"-04")}
        {pastEventCell(yr+"-05")}
        {pastEventCell(yr+"-06")}
        {pastEventCell(yr+"-07")}
        {pastEventCell(yr+"-08")}
        {pastEventCell(yr+"-09")}
        {pastEventCell(yr+"-10")}
        {pastEventCell(yr+"-11")}
        {pastEventCell(yr+"-12")}
      </TableRow>)}
    </TableBody>
  </Table>


  return <>
    <h3>Past 12 Months</h3>
    <Grid container spacing={2}>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Number of Events
            </Typography>
            <Typography variant="h4" component="div">
              {report.events.counts.pastYear || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Hours Volunteered
            </Typography>
            <Typography variant="h4" component="div">
              {report.events.counts.pastYearHours || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Oversubscribed Events
            </Typography>
            <Typography variant="h4" component="div">
              {report.events.counts.pastYearOversubscribed || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Number of Socials
            </Typography>
            <Typography variant="h4" component="div">
              {report.socials.counts.pastYear || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <h3>Past Events and Socials</h3>
    {pastEvents}

    <h3>Upcoming Events</h3>
    <p>
      There {report.events.counts.upcoming !== 1 ? "are" : "is"} {report.events.counts.upcoming || 0} upcoming event{report.events.counts.upcoming !== 1 ? "s" : ""}, and {report.socials.counts.upcoming || 0} upcoming social{report.socials.counts.upcoming !== 1 ? "s" : ""}.
      {report.events.next !== null ? ` The next event starts in ${report.events.nextDays} day${report.events.nextDays !== 1 ? "s" : ""}, on ${report.events.next}.` : null }
    </p>
  </>

  // TODO: Summary of events in the past year (number, number only available to under 25s, socials)
  // TODO: Allocation summary?
  // TODO: People who haven't attended at least two events in the past year
  // TODO: Geographic split
}