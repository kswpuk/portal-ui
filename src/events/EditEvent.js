import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/navSlice'

import { useEffect } from 'react'
import { useEditEventMutation, useGetEventQuery } from '../redux/eventsApi'

import { useNavigate, useParams } from 'react-router-dom'
import EventForm from './EventForm'
import Loading from '../common/Loading'
import Error from '../common/Error'

export default function EditEvent() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { eventSeriesId, eventId } = useParams()
  const { data: event, error, isLoading, refetch } = useGetEventQuery({eventSeriesId, eventId})

  const [ editEvent, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useEditEventMutation()

  const submit = (eventSeriesId, eventId, body) => {
    editEvent({eventSeriesId, eventId, body})
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
    error={submitError} submitting={isSubmitting}
    eventSeriesId={eventSeriesId} eventId={eventId}
    onSubmit={({eventSeriesId, eventId, body}) => submit(eventSeriesId, eventId, body) } />

}