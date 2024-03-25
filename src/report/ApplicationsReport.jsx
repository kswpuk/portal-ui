import Error from "../common/Error"
import Loading from "../common/Loading"
import { useApplicationsReportQuery } from "../redux/applicationsApi"

export default function ApplicationsReport() {
  const { data: report, error, isLoading, refetch } = useApplicationsReportQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the Applications report</Error>
  }

  if(report.count === 0){
    return <p>There are currently no applications to join the KSWP in progress.</p>
  }

  var appCountText = null
  if(report.count > 1){
    appCountText = "There are currently "+report.count+" applications in progress. The most recent application was made on "+report.newest+" ("+report.newestDays+" day"+(report.newestDays !== 1 ? "s" : "")+" ago), and the oldest application was made on "+report.oldest+" ("+report.oldestDays+" day"+(report.oldestDays !== 1 ? "s" : "")+" ago)."
  }else{
    appCountText = "There is currently 1 application in progress, which was made on "+report.newest+" ("+report.newestDays+" day"+(report.newestDays !== 1 ? "s" : "")+" ago)."
  }

  return <>
    <p>{appCountText}</p>
  </>

  // TODO: Open applications - what are we waiting on for each application
}