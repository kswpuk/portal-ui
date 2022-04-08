import Error from "../common/Error";
import Loading from "../common/Loading";
import { useListEventsQuery } from "../redux/eventsApi";
import HomeEventsNext from "./HomeEventsNext";
import HomeEventsUpcoming from "./HomeEventsUpcoming";

export default function HomeEvents(props) {
  const { data: events, error, isLoading, refetch } = useListEventsQuery(false)

  if (isLoading || !events) {
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={refetch} />
  }

  return <>
    <HomeEventsNext event={events.find(e => e.allocation === "ALLOCATED")} />
    <HomeEventsUpcoming events={events} />
  </>
}