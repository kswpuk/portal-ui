import EventCard from "../events/EventCard";

export default function HomeEventsNext(props) {
  if(!props.event)
    return null
  
  return <EventCard event={props.event} title="Your Next Event" hideAllocation hideDeadline flat />
}