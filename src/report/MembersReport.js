import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useMembersReportQuery } from "../redux/membersApi"

export default function MembersReport() {
  const { data: report, error, isLoading, refetch } = useMembersReportQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the Members report</Error>
  }

  // Process time data
  const timeMax = Math.max(...Object.keys(report.counts.time).map(a => parseInt(a))) + 1
  const time = {}
  Array.from(Array(timeMax).keys()).forEach(a => time[a] = report.counts.time[a] || 0)

  // Format labels
  const lblFormatter = (lbl) => {
    if(lbl === "UNDER_18"){
      return "Under 18"
    }else if(lbl === "OVER_65"){
      return "65+"
    }else{
      return lbl.substr(0, 2) + " - " + lbl.substr(3, 2)
    }
  }

  return <>
    <p>
      There {report.counts.status.ACTIVE !== 1 ? "are" : "is"} currently {report.counts.status.ACTIVE || 0} active member{report.counts.status.ACTIVE !== 1 ? "s" : ""}, and {report.counts.status.INACTIVE || 0} inactive member{report.counts.status.INACTIVE !== 1 ? "s" : ""}.
      The newest member of the KSWP joined on {report.newest} ({report.newestDays} day{report.newestDays !== 1 ? "s" : ""} ago).
    </p>

    <h3>Member Age</h3>
    <ResponsiveContainer width="100%" height={400}>
    <BarChart data={Object.keys(report.counts.age).map((key) => { return { "ageGroup": key, "count": report.counts.age[key], "active": report.counts.ageActive[key], "inactive": report.counts.ageInactive[key] }})}>
      <CartesianGrid strokeDasharray="5 10" vertical={false} />
      <XAxis dataKey="ageGroup" tickFormatter={lblFormatter}/>
      <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
      <Tooltip labelFormatter={lblFormatter} formatter={(value, name, props) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
      <Bar dataKey="active" fill="#a60c2b" stackId="age" label="Active" />
      <Bar dataKey="inactive" fill="#fdce72" stackId="age" label="Inactive">
        <LabelList dataKey="count" position="insideTop" fill="#ffffff" formatter={lbl => lbl === 0 ? "" : lbl} />
      </Bar>
    </BarChart>
    </ResponsiveContainer>

    <h3>Years in the KSWP</h3>
    <ResponsiveContainer width="100%" height={400}>
    <BarChart data={Object.keys(time).map((key) => { return { "timeSpent": key, "count": time[key] }})}>
      <CartesianGrid strokeDasharray="5 10" vertical={false} />
      <XAxis dataKey="timeSpent" />
      <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
      <Bar dataKey="count" fill="#a60c2b">
        <LabelList dataKey="count" position="insideTop" fill="#ffffff" formatter={lbl => lbl === 0 ? "" : lbl} />
      </Bar>
    </BarChart>
    </ResponsiveContainer>
  </>
}