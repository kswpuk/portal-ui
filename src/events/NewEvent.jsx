import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/navSlice'

import { useEffect, useState } from 'react'
import { useCreateEventMutation } from '../redux/eventsApi'

import { useNavigate } from 'react-router-dom'
import EventForm from './EventForm'
import { fetchAuthSession } from 'aws-amplify/auth'

export default function NewEvent() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [eventSeriesId, setEventSeriesId] = useState(null)
  const [eventId, setEventId] = useState(null)
  const [isSocialCoordinator, setIsSocialCoordinator] = useState(false);

  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"];
    setIsSocialCoordinator(groups.includes("SOCIALS") && !groups.includes("EVENTS") && !groups.includes("MANAGER") && !groups.includes("PORTAL"));
  })

  const [ submitEvent, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useCreateEventMutation()

  const submit = (eventSeriesId, eventId, body) => {
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