import { Card, CardContent, Grid, Typography } from "@mui/material"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useEventsAttendanceReportQuery } from "../redux/eventsApi"
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function EventsAttendanceReport() {
  const { data: report, error, isLoading, refetch } = useEventsAttendanceReportQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the Events Attendance report</Error>
  }

  let maxDay = Math.max(...Object.keys(report.days).map(s => parseInt(s)))
  let days = []
  let totalDays = 0;
  let peopleCount = 0;
  for (let i = 0; i <= maxDay; i++) {
    let v = report.days[i.toString()] || 0

    days.push(v)
    totalDays += v*i
    peopleCount += v
  }

  let percentageAtLeast = []
  let runningTotal = peopleCount
  for (let i = 0; i <= maxDay; i++) {
    percentageAtLeast.push(runningTotal/peopleCount)
    runningTotal -= days[i]
  }

  return <>
    <h3>Event Attendance (Past 12 Months)</h3>
    <Grid container spacing={2}>
      <Grid item xs={6} md={4} lg={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Total Volunteer Days
            </Typography>
            <Typography variant="h4" component="div">
              {totalDays}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
    <h3>Number of Active Members volunteering X days (Past 12 Months)</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={days.map((value, idx) => { return { "days": idx, "count": value }})}>
        <CartesianGrid strokeDasharray="5 10" vertical={false} />
        <XAxis dataKey="days" />
        <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
        <Bar dataKey="count" fill="#a60c2b">
          <LabelList dataKey="count" position="insideTop" fill="#ffffff" formatter={lbl => lbl === 0 ? "" : lbl} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <h3>Percentage of Active Members volunteering at least X days (Past 12 Months)</h3>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={percentageAtLeast.map((value, idx) => { return { "days": idx, "pct": value*100 }})}>
        <CartesianGrid strokeDasharray="5 10" vertical={false} />
        <XAxis dataKey="days" />
        <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
        <Line dataKey="pct" fill="#a60c2b">
          <LabelList dataKey="pct" position="top"  formatter={lbl => lbl === 0 ? "" : lbl.toFixed(2)} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </>
}