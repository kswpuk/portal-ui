import { Grid } from "@mui/material";
import PostcodeAreaMap from "./PostcodeAreaMap";

import { useMembersReportQuery } from "../redux/membersApi"
import Loading from "../common/Loading";
import Error from "../common/Error";
import { useEventsReportQuery } from "../redux/eventsApi";
import { useApplicationsReportQuery } from "../redux/applicationsApi";

export default function Maps() {
  const { data: events, isLoading: eventsIsLoading, error: eventsError  } = useEventsReportQuery()
  const { data: members, isLoading: membersIsLoading, error: membersError  } = useMembersReportQuery()
  const { data: applications, isLoading: applicationsIsLoading, error: applicationsError  } = useApplicationsReportQuery()

  
  var eventsMap = null;
  if(eventsIsLoading){
    eventsMap = <Loading />
  }else if(eventsError){
    eventsMap = <Error error={eventsError}>An error occurred whilst loading the Members report</Error>
  }else if(events !== null){
    eventsMap = <PostcodeAreaMap data={events.events.counts.postcodesPastYear} />
  }

  var membersMap = null;
  if(membersIsLoading){
    membersMap = <Loading />
  }else if(membersError){
    membersMap = <Error error={membersError}>An error occurred whilst loading the Members report</Error>
  }else if(members !== null){
    membersMap = <PostcodeAreaMap data={members.counts.postcodesActive} />
  }

  var applicationsMap = null;
  if(applicationsIsLoading){
    applicationsMap = <Loading />
  }else if(applicationsError){
    applicationsMap = <Error error={applicationsError}>An error occurred whilst loading the Applications report</Error>
  }else if(applications !== null){
    applicationsMap = <PostcodeAreaMap data={applications.counts.postcode} />
  }

  return <Grid container>
    <Grid item md={12} lg={4}>
      <h3>Events (past year)</h3>
      {eventsMap}
    </Grid>
    <Grid item md={12} lg={4}>
      <h3>Members (active)</h3>
      {membersMap}
    </Grid>
    <Grid item md={12} lg={4}>
      <h3>Applications</h3>
      {applicationsMap}
    </Grid>
  </Grid>
}