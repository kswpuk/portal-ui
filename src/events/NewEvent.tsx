import { setTitle } from '../redux/navSlice'

import { useEffect, useState } from 'react'
import { useCreateEventMutation } from '../redux/eventsApi'

import { useNavigate } from 'react-router-dom'
import EventForm from './EventForm'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useAppDispatch } from '../redux/hooks'

export default function NewEvent() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const [eventSeriesId, setEventSeriesId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [isSocialCoordinator, setIsSocialCoordinator] = useState(false);

  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[];
    setIsSocialCoordinator(groups.includes("SOCIALS") && !groups.includes("EVENTS") && !groups.includes("MANAGER") && !groups.includes("PORTAL"));
  })

  const [ submitEvent, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useCreateEventMutation()

  const submit = (eventSeriesId: string, eventId: string, body: EventBody) => {
    setEventSeriesId(eventSeriesId)
    setEventId(eventId)

    submitEvent({eventSeriesId, eventId, body, social: isSocialCoordinator})
  }

  useEffect(() => {
    dispatch(setTitle("New Event"))
  }, [dispatch])

  useEffect(() => {
    if(isSubmitted){
      navigate(`/events/${eventSeriesId}/${eventId}`)
    }
  }, [navigate, isSubmitted, eventSeriesId, eventId])

  return <EventForm 
    social={isSocialCoordinator}
    error={submitError} submitting={isSubmitting}
    onSubmit={({eventSeriesId, eventId, body}) => submit(eventSeriesId, eventId, body) } />

}