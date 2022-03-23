import { ArrowForward, Close, CurrencyPound, EmojiEvents, Event, MoreHoriz } from "@mui/icons-material"
import { Avatar, Box, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Link, MenuItem, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link as RouterLink, useParams } from "react-router-dom"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useGetEventQuery, useRegisterForEventMutation, useAllocateToEventMutation } from "../redux/eventsApi"
import { setTitle } from "../redux/navSlice"
import moment from "moment"
import { Auth } from "aws-amplify"
import AllocationWidget, {getAllocationText} from "./AllocationWidget"
import IconText from "../common/IconText"
import LocationWidget from "./LocationWidget"
import MemberPhoto from "../common/MemberPhoto"
import { DataGrid } from "@mui/x-data-grid"
import Privileged from "../common/Privileged"
import { ALLOCATED, ALLOCATION_ORDERING, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts"
import SubmitButton from "../common/SubmitButton"
import ButtonMenu from "../common/ButtonMenu"
import CriteriaWidget from "./CriteriaWidget"

export default function ViewEvent(){
  const dispatch = useDispatch()

  const { eventSeriesId, eventId } = useParams()
  const { data: event, error, isLoading, refetch } = useGetEventQuery({eventSeriesId, eventId})
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation()
  const [allocateToEvent, {isLoading: isAllocating}] = useAllocateToEventMutation()

  useEffect(() => {
    if(event) {
      dispatch(setTitle(event.name))
    }else{
      dispatch(setTitle("View Event"))
    }
  }, [dispatch, event])

  const [membershipNumber, setMembershipNumber] = useState(null);
  Auth.currentUserInfo().then(user => setMembershipNumber(user.username));

  const [showAllocations, setShowAllocations] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);

  
  if(isLoading || membershipNumber === null){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading this event</Error>
  }

  // TODO: Menu for edit event, delete event
  // TODO: Descriptive text for weightings
  // TODO: Map?

  // Event dates

  const now = new moment()
  const registrationDate = new moment(event.registrationDate)
  registrationDate.set('hour', 23)
  registrationDate.set('minute', 59)
  registrationDate.set('second', 59)
  const startDate = new moment(event.startDate)
  const endDate = new moment(event.endDate)

  // Event payee

  let eventPayee = null
  switch (event.payee){
    case "_organiser":
      eventPayee = "the event organiser"
      break
    case "_qswp":
      eventPayee = "the QSWP"
      break
    default:
      eventPayee = event.payee
  }

  // Event type

  let eventType = null
  if (event.type === "social"){
    eventType = "This is a social event, and does not impact event allocations"
  }else if(event.type === "no_impact"){
    eventType = "Attendance at this event does not impact event allocations."
  }

  // Allocation Criteria

  let spaces = "There is no limit on the number of attendees for this event."
  if(event.attendanceLimit > 0){
    spaces = "There are "+event.attendanceLimit+" spaces available to attend this event."
  }

  let weighting = null
  if(event.weightingCriteria && event.weightingCriteria.length > 0){
    weighting = <>
      <Typography variant="body1">The following weighting criteria will be used if this event is over-subscribed:</Typography>
      <ul>
        {event.weightingCriteria.map((x, idx) => <li key={"weighting_"+idx}>x</li>)}
      </ul>
    </>
  }

  // Allocations

  let allocations = null
  const allocationCountByType = {};
  if(event.allocations && event.allocations.length > 0){
    allocations = <Box sx={{display: 'flex', flexWrap: 'wrap', marginBottom: 1}}>
      {event.allocations.map(a => <Avatar key={a.membershipNumber} className={"allocation_outline_"+a.allocation} sx={{margin: 0.5, borderWidth: '2px', borderStyle: 'solid', height: '48px', width: '48px'}}>
        <MemberPhoto membershipNumber={a.membershipNumber} thumb title={(a.preferredName || a.firstName) ? `${a.preferredName || a.firstName} ${a.surname}` : a.membershipNumber}/>
      </Avatar>)}
      <IconButton onClick={() => setShowAllocations(true)}>
        <MoreHoriz />
      </IconButton>
    </Box>

    event.allocations.forEach(a => allocationCountByType[a.allocation] = (allocationCountByType[a.allocation] || 0) + 1)
  }
  
  const listJoin = (arr, s1, s2) => arr.slice(0,-1).join(s1).concat(arr.length > 1 ? s2 : '', arr.slice(-1));
  const personOrPeople = v => v === 1 ? "person is" : "people are"

  const allocationCountText = listJoin(Object.entries(allocationCountByType)
    .sort((a, b) => ALLOCATION_ORDERING[a[0]] - ALLOCATION_ORDERING[b[0]])
    .map(o => `${o[1]} ${personOrPeople(o[1])} ${getAllocationText(o[0]).toLowerCase()}`),
    ", ", ", and ")

  const currentAllocation = (event.allocations.find(x => x.membershipNumber === membershipNumber) || {})['allocation']

  return <>
    <Grid container spacing={2}>
      <Grid item md={8}>
        <Typography variant="body1" gutterBottom>{event.description}</Typography>

        {event.details ? <>
          <Typography variant="h6">Event Details</Typography>
          <Typography variant="body1" gutterBottom>{event.details}</Typography>
          {event.eventUrl ? <Link href={event.eventUrl} target="_blank">More information</Link> : null }
        </> : null}

        <Typography variant="h6">Allocation Criteria</Typography>
        <Typography variant="body1" gutterBottom>
          {spaces}
          {now.isBefore(registrationDate) ?
            <> You must sign up by <strong><time dateTime={registrationDate.format("YYYY-MM-DD")}>{registrationDate.format("D MMMM YYYY")}</time></strong> if you wish to attend.</> :
            <> The deadline for signing up for this event was <strong><time dateTime={registrationDate.format("YYYY-MM-DD")}>{registrationDate.format("D MMMM YYYY")}</time></strong>.</>
          }
        </Typography>
        
        <CriteriaWidget criteria={event.attendanceCriteria} eligibility={event.eligibility.rules} />

        {weighting}
        
      </Grid>
      <Grid item md={4}>
        <Card elevation={3} sx={{marginBottom: '1rem'}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Essentials</Typography>
            <IconText icon={<Event />} marginBottom='0.5rem'>
              <time dateTime={startDate.format("YYYY-MM-DD HH:mm:ss")}>{startDate.format("HH:mm, D MMMM YYYY")}</time>
            </IconText>
            <IconText icon={<ArrowForward color="disabled" />} marginBottom='1.5rem'>
              <time dateTime={endDate.format("YYYY-MM-DD HH:mm:ss")}>{endDate.format("HH:mm, D MMMM YYYY")}</time>
            </IconText>

            <LocationWidget event={event} marginBottom='1.5rem' />

            {eventType != null ? <IconText icon={<EmojiEvents />} marginBottom='1.5rem'>
              {eventType}
            </IconText> : null }

            {event.cost > 0 ?  <IconText icon={<CurrencyPound />} marginBottom='1.5rem'>
              <strong>&pound;{event.cost.toFixed(2)}</strong>, payable to {eventPayee}.
            </IconText> : null}
          </CardContent>
        </Card>

        <Card elevation={3} className={"allocation_"+currentAllocation}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Attendance</Typography>
            <AllocationWidget allocation={currentAllocation} verbose marginBottom={allocations !== null ? '1.5rem' : '0rem'}/>
            {allocations}
            {allocationCountText}
            
          </CardContent>
          {event.eligibility.eligible === true && now.isBefore(registrationDate) && (!currentAllocation || currentAllocation === "REGISTERED") ? <CardActions>
              <SubmitButton
                submitting={isRegistering} submittingText="Updating..."
                onClick={() => registerForEvent({eventSeriesId, eventId, membershipNumber})}>
                { currentAllocation ? "Unregister from event" : "Register for event" }
              </SubmitButton>
            </CardActions>
          : null }
        </Card>
      </Grid>
    </Grid>

    <Dialog onClose={() => setShowAllocations(false)} open={showAllocations} maxWidth="lg" fullWidth>
      <DialogTitle>
        Allocations for {event.name}
        <IconButton
          aria-label="close"
          onClick={() => setShowAllocations(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DataGrid autoHeight initialState={{
          pagination: {
            pageSize: 25,
          },
          sorting: {
            sortModel: [{ field: "surname", sort: "asc"}]
          }
          }} columns={[
            {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
              renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><Link component={RouterLink} to={"/members/"+params.value+"/view"}>{params.value}</Link></Privileged>},
            {field: "name", headerName: "First Name", flex: 2, hideable: false, valueGetter: params => params.row.preferredName || params.row.firstName},
            {field: "surname", headerName: "Surname", flex: 2, hideable: false},
            {field: "allocation", headerName: "Allocation", flex: 2, hideable: false,
              renderCell: params => <AllocationWidget textOnly allocation={params.value} />}
          ]} rows={event.allocations}
          getRowId={(row) => row.membershipNumber}
          getRowClassName={(params) => `allocation_${params.row.allocation}`}
          checkboxSelection={true}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
        />
        <Privileged allowed={["EVENTS"]}>
          <Box sx={{mt: '1rem'}}>
            <ButtonMenu buttonText="Update Allocations" disabled={selectionModel.length === 0 || isAllocating}>
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": REGISTERED, "membershipNumbers": selectionModel}]})}>Registered</MenuItem>
              <Divider />
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ALLOCATED, "membershipNumbers": selectionModel}]})}>Allocated</MenuItem>
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": RESERVE, "membershipNumbers": selectionModel}]})}>Reserve</MenuItem>
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NOT_ALLOCATED, "membershipNumbers": selectionModel}]})}>Not Allocated</MenuItem>
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": DROPPED_OUT, "membershipNumbers": selectionModel}]})}>Dropped Out</MenuItem>
              <Divider />
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ATTENDED, "membershipNumbers": selectionModel}]})}>Attended</MenuItem>
              <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NO_SHOW, "membershipNumbers": selectionModel}]})}>No Show</MenuItem>
            </ButtonMenu>
          </Box>
        </Privileged>
      </DialogContent>
    </Dialog>
  </>
}