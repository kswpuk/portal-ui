import { ArrowForward, Close, CurrencyPound, Delete, Edit, EmojiEvents, Event, MoreHoriz } from "@mui/icons-material"
import { Avatar, Box, Button, Card, CardActions, CardContent, Grid, IconButton, Link, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useGetEventQuery, useRegisterForEventMutation, useDeleteEventMutation } from "../redux/eventsApi"
import { setTitle } from "../redux/navSlice"
import moment from "moment"
import { fetchAuthSession } from 'aws-amplify/auth'
import AllocationWidget, {getAllocationText} from "./AllocationWidget"
import IconText from "../common/IconText"
import LocationWidget from "./LocationWidget"
import MemberPhoto from "../common/MemberPhoto"
import Privileged from "../common/Privileged"
import { ALLOCATED, ALLOCATION_ORDERING, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts"
import SubmitButton from "../common/SubmitButton"
import CriteriaWidget from "./CriteriaWidget"
import ConfirmLink from "../common/ConfirmLink"
import DateWidget from "../common/DateWidget"
import ReactMarkdown from 'react-markdown'
import { grey } from '@mui/material/colors';
import ViewAllocationsDialog from "./ViewAllocationsDialog"
import WeightingWidget from "./WeightingWidget"

export default function ViewEvent(){
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { eventSeriesId, eventId } = useParams()
  const { data: event, error, isLoading, refetch } = useGetEventQuery({eventSeriesId, eventId})
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation()
  const [ deleteEvent, { isLoading: isDeleting, isSuccess: isDeleted } ] = useDeleteEventMutation()

  useEffect(() => {
    if(event) {
      dispatch(setTitle(event.name))
    }else{
      dispatch(setTitle("View Event"))
    }
  }, [dispatch, event])

  useEffect(() => {
    if(isDeleted){
      navigate("/events")
    }
  }, [navigate, isDeleted])

  const [membershipNumber, setMembershipNumber] = useState(null);
  const [isSocialCoordinator, setIsSocialCoordinator] = useState(false);
  fetchAuthSession().then(session => {
    const username = session.tokens?.accessToken.payload["username"];
    setMembershipNumber(username)

    const groups = session.tokens?.accessToken.payload["cognito:groups"];
    setIsSocialCoordinator(groups.includes("SOCIALS") && !groups.includes("EVENTS") && !groups.includes("MANAGER"));
  })

  const [showAllocations, setShowAllocations] = useState(false);

  if(isLoading || membershipNumber === null){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading this event</Error>
  }

  // TODO: Map?

  // Event dates

  const now = new moment()
  const registrationDate = new moment(event.registrationDate)
  registrationDate.set('hour', 23)
  registrationDate.set('minute', 59)
  registrationDate.set('second', 59)

  // Event payee

  let eventPayee = null
  switch (event.payee){
    case "_organiser":
      eventPayee = "the event organiser"
      break
    case "_qswp":
      eventPayee = "the KSWP"
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

  let weighting = null

  if(event.attendanceLimit > 0){
    if(event.allocationOnPayment) {
      weighting = <Typography variant="body1">There are <strong>{event.attendanceLimit}</strong> spaces available to attend this event. Places will be allocated upon receipt of payment, on a first-come-first-served basis.</Typography>
    } else {
      if(event.weightingCriteria && Object.keys(event.weightingCriteria).length > 0){
        weighting = <>
          <Typography variant="body1">There are <strong>{event.attendanceLimit}</strong> spaces available to attend this event. If it is over-subscribed, names will be drawn from a virtual hat. Everyone who registers will start with one name in the hat, and then the following rules will be applied:</Typography>
          <WeightingWidget criteria={event.weightingCriteria} />
          <Typography variant="body1" gutterBottom>After the above rules have been applied, everyone will receive an equal number of additional names until everyone has at least 1 name in the hat.</Typography>
        </>
      }else{
        weighting = <Typography variant="body1" gutterBottom>There are <strong>{event.attendanceLimit}</strong> spaces available to attend this event. If it is over-subscribed, names will be drawn from a virtual hat. Everyone's name will be placed in the hat the same number of times.</Typography>
      }

      weighting = <>
        {weighting}
        <Typography variant="body1">The Events Coordinator may allocate specific people where there is a specific requirement for them to attend - e.g. they have a some skill, experience or qualification that is required.</Typography>
      </>
    }
  }else{
    if(event.allocationOnPayment) {
      weighting = <Typography variant="body1" gutterBottom>There is no limit on the number of attendees for this event. You will be allocated to this event upon receipt of payment, on a first-come-first-served basis.</Typography>
    } else {
      weighting = <Typography variant="body1" gutterBottom>There is no limit on the number of attendees for this event.</Typography>
    }
  }

  // Allocations

  const allocationToOrder = (alloc) =>{
    switch(alloc){
      case ATTENDED:
        return 0;
      case ALLOCATED:
        return 1;
      case RESERVE:
        return 2;
      case REGISTERED:
        return 3;
      case NOT_ALLOCATED:
        return 4;
      case NO_SHOW:
        return 5;
      case DROPPED_OUT:
        return 6;
      default:
        return 10;
    }
  }

  let allocations = null
  const allocationCountByType = {};
  if(event.allocations && event.allocations.length > 0){
    const sortedAllocations = [...event.allocations].sort((a, b) => (a.preferredName || a.firstName) - (b.preferredName || b.firstName))
    sortedAllocations.sort((a, b) => a.surname - b.surname)
    sortedAllocations.sort((a, b) => allocationToOrder(a.allocation) - allocationToOrder(b.allocation))

    allocations = <Box sx={{display: 'flex', flexWrap: 'wrap', marginBottom: 1}}>
      {sortedAllocations.map(a => <Avatar key={a.membershipNumber} className={"allocation_outline_"+a.allocation} sx={{margin: 0.5, borderWidth: '2px', borderStyle: 'solid', height: '48px', width: '48px'}}>
        <MemberPhoto membershipNumber={a.membershipNumber} thumb title={(a.preferredName || a.firstName) ? `${a.preferredName || a.firstName} ${a.surname}` : a.membershipNumber}/>
      </Avatar>)}
      <Avatar sx={{margin: 0.5, backgroundColor: grey[300], height: '48px', width: '48px'}}>
        <IconButton onClick={() => setShowAllocations(true)}>
          <MoreHoriz />
        </IconButton>
      </Avatar>
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
          <ReactMarkdown components={{h1 : 'strong', h2: 'strong', h3: 'strong', h4: 'strong', h5: 'strong', h6: 'strong', p: ({node, ...props}) => <Typography gutterBottom variant="body1" {...props} />}}>{event.details}</ReactMarkdown>
          {event.eventUrl ? <Typography variant="body1" gutterBottom><Link href={event.eventUrl} target="_blank">More information</Link></Typography> : null }
        </> : null}

        <Typography variant="h6" sx={{marginTop: '1.5rem'}}>Attendance Criteria</Typography>
        <Typography variant="body1" gutterBottom>{now.isBefore(registrationDate) ?
          <> You must sign up by <strong><DateWidget date={event.registrationDate} dateOnly /></strong> if you wish to attend.</> :
          <> The deadline for signing up for this event was <strong><DateWidget date={event.registrationDate} dateOnly /></strong>.</>
        }</Typography>

        <CriteriaWidget criteria={event.attendanceCriteria} eligibility={event.eligibility.rules} />

        <Typography variant="h6" sx={{marginTop: '1.5rem'}}>Allocation Criteria</Typography>
        {weighting}
        
      </Grid>
      <Grid item md={4}>
        <Card elevation={3} sx={{marginBottom: '1rem'}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Essentials</Typography>
            <IconText icon={<Event />} marginBottom='0.5rem'>
              <DateWidget date={event.startDate} />
            </IconText>
            <IconText icon={<ArrowForward color="disabled" />} marginBottom='1.5rem'>
              <DateWidget date={event.endDate} />
            </IconText>

            <LocationWidget event={event} marginBottom='1.5rem' />

            {eventType != null ? <IconText icon={<EmojiEvents />} marginBottom='1.5rem'>
              {eventType}
            </IconText> : null }

            {event.cost > 0 ?  <IconText icon={<CurrencyPound />} marginBottom='1.5rem'>
              <span><strong>&pound;{event.cost.toFixed(2)}</strong>, payable to {eventPayee}.</span>
            </IconText> : null}
          </CardContent>
        </Card>

        <Card elevation={3} className={"allocation_"+currentAllocation}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Attendance</Typography>
            <AllocationWidget allocation={currentAllocation} verbose marginBottom={allocations !== null ? '1.5rem' : '0rem'} eligible={event.eligibility.eligible}/>
            {allocations}
            {allocationCountText}
            
          </CardContent>
          <CardActions>
            {event.eligibility.eligible === true && now.isBefore(registrationDate) && (!currentAllocation || currentAllocation === "REGISTERED") ? <SubmitButton
                submitting={isRegistering} submittingText="Updating..."
                onClick={() => registerForEvent({eventSeriesId, eventId, membershipNumber})}>
                { currentAllocation ? "Unregister from event" : "Register for event" }
              </SubmitButton> : null }
          
            {event.allocations && event.allocations.length === 0 ? <Privileged allowed={event.type === "social" ? ["EVENTS", "SOCIALS"] : ["EVENTS"]}>
              <Button onClick={() => setShowAllocations(true)}>Manage Allocations</Button>
            </Privileged> : null}
          </CardActions>
        </Card>
      </Grid>
    </Grid>

    <Privileged allowed={event.type === "social" ? ["EVENTS", "SOCIALS"] : ["EVENTS"]}>
      <SpeedDial
        ariaLabel="Event Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >

        <SpeedDialAction
          icon={<Link sx={{display: "flex"}} component={RouterLink} to={"/events/"+eventSeriesId+"/"+eventId+"/edit"}><Edit /></Link>}
          tooltipTitle="Edit"
          tooltipOpen
        />

        <SpeedDialAction 
          icon={<ConfirmLink sx={{display: "flex"}} title={"Delete "+(event?.name || "event")+"?"} loading={isDeleting}
            onConfirm={() => deleteEvent({eventSeriesId, eventId, social: isSocialCoordinator})}
            body={"Are you sure you wish to delete "+(event?.name || "this event")+"? This action is permanent, and cannot be undone."}><Delete />
          </ConfirmLink>}
          tooltipTitle="Delete"
          tooltipOpen
        />
      </SpeedDial>
    </Privileged>

    <ViewAllocationsDialog event={event} onClose={() => setShowAllocations(false)} open={showAllocations} />

  </>
}