export default function WeightingWidget(props){
  return <ul>
    {Object.entries(props.criteria).map((x, idx) => <li key={"weighting_"+idx}>If you <strong>{getRuleText(x[0])}</strong>, {getWeightingText(x[0], x[1])}</li>)}
  </ul>
}

function getRuleText(rule) {
  switch(rule){
    // Age
    case "under_25":
      return "are under 25"
    case "over_25":
      return "are over 25"
    // Attended Previously
    case "attended":
      return "attended this event previously"
    case "attended_1yr":
      return "attended this event in the last year"
    case "attended_2yr":
      return "attended this event in the last 2 years"
    case "attended_3yr":
      return "attended this event in the last 3 years"
    case "attended_5yr":
      return "attended this event in the last 5 years"
    // Dropped Out
    case "droppedout_6mo":
      return "dropped out of an event in the last 6 months"
    case "droppedout_1yr":
      return "dropped out of an event in the last year"
    case "droppedout_2yr":
      return "dropped out of an event in the last 2 years"
    case "droppedout_3yr":
      return "dropped out of an event in the last 3 years"
    // No Show
    case "noshow_6mo":
      return "didn't turn up to an event in the last 6 months with little or no warning"
    case "noshow_1yr":
      return "didn't turn up to an event in the last year with little or no warning"
    case "noshow_2yr":
      return "didn't turn up to an event in the last 2 years with little or no warning"
    case "noshow_3yr":
      return "didn't turn up to an event in the last 3 years with little or no warning"
    // Joined
    case "joined_1yr":
      return "joined in the last year"
    case "joined_2yr":
      return "joined in the last 2 years"
    case "joined_3yr":
      return "joined in the last 3 years"
    case "joined_5yr":
      return "joined in the last 5 years"
    // QSA
    case "qsa_1yr":
      return "received your King/Queen's Scout Award in the last year"
    case "qsa_2yr":
      return "received your King/Queen's Scout Award in the last 2 years"
    case "qsa_3yr":
      return "received your King/Queen's Scout Award in the last 3 years"
    case "qsa_5yr":
      return "received your King/Queen's Scout Award in the last 5 years"
    default:
      return <>{rule}</>
  }
}

function getWeightingText(rule, weighting) {
  const val = Math.abs(weighting)

  const occasion = rule.startsWith("noshow_") || rule.startsWith("droppedout_")

  return val + " name" + (val > 1 ? "s" : "") + " will be " + (weighting < 0 ? "removed" : "added")+(occasion ? " per occasion" : "")
}