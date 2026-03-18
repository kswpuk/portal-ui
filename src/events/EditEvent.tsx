import { setTitle } from '../redux/navSlice'

import { useEffect, useState } from 'react'
import { useEditEventMutation, useGetEventQuery } from '../redux/eventsApi'

import { useNavigate, useParams } from 'react-router-dom'
import EventForm from './EventForm'
import Loading from '../common/Loading'
import Error from '../common/Error'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useAppDispatch } from '../redux/hooks'

export default function EditEvent() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const { eventSeriesId, eventId } = useParams()
  const { data: event, error, isLoading, refetch } = useGetEventQuery({eventSeriesId: eventSeriesId || "", eventId: eventId || ""})

  const [isSocialCoordinator, setIsSocialCoordinator] = useState(false);
  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[];
    setIsSocialCoordinator(groups.includes("SOCIALS") && !groups.includes("EVENTS") && !groups.includes("MANAGER") && !groups.includes("PORTAL"));
  })

  const [ editEvent, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useEditEventMutation()

  const submit = (eventSeriesId: string, eventId: string, body: EventBody) => {
    editEvent({eventSeriesId, eventId, body, social: isSocialCoordinator})
  }

  useEffect(() => {
    if(event){
      dispatch(setTitle("Edit "+event.name))
    }else{
      dispatch(setTitle("Edit Event"))
    }
    
  }, [dispatch, event])

  useEffect(() => {
    if(isSubmitted){
      navigate(`/events/${eventSeriesId}/${eventId}`)
    }
  }, [navigate, isSubmitted, eventSeriesId, eventId])

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading details of event {eventSeriesId}/{eventId}</Error>
  }

  return <EventForm 
    event={event}
    social={isSocialCoordinator}
    error={submitError} submitting={isSubmitting}
    eventSeriesId={eventSeriesId} eventId={eventId}
    onSubmit={({eventSeriesId, eventId, body}) => submit(eventSeriesId, eventId, body) } />

}