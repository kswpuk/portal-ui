import EventCard from "../events/EventCard";

interface HomeEventsNextProps {
  /**
   * Event to display (i.e. the current user's next event).
   * If not set, then this card will return null.
   */
  event?: EventListItem
}

export default function HomeEventsNext(props: HomeEventsNextProps) {
  if(!props.event)
    return null
  
  return <EventCard event={props.event} title="Your Next Event" hideAllocation hideDeadline flat />
}