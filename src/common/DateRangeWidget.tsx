import { Event } from "@mui/icons-material"
import moment from "moment"
import IconText from "./IconText"

interface DateRangeWidgetProps {
  /** Start of the date range. Accepts any value that moment can parse. */
  startDate: moment.MomentInput
  /** End of the date range. Accepts any value that moment can parse. */
  endDate: moment.MomentInput
  /** Bottom margin passed through to the underlying `IconText`. */
  marginBottom?: string | number
}

/**
 * Renders a date range as an icon + text row, collapsing shared parts to avoid repetition.
 *
 * - Same day: `"15 June 2025"`
 * - Same month: `"14 - 15 June 2025"`
 * - Same year: `"14 May - 15 June 2025"`
 * - Different years: `"31 December 2025 - 1 January 2026"`
 */
export default function DateRangeWidget(props: DateRangeWidgetProps){
  const startDate = moment(props.startDate)
  const endDate = moment(props.endDate)

  let date = null

  const endDateFormat = endDate.format("D MMMM YYYY")
  if(startDate.format("D MMMM YYYY") === endDateFormat){
    // Same day
    date = startDate.format("D MMMM YYYY")
  }else if(startDate.month() === endDate.month()){
    // Different days, same month
    date = startDate.date() + " - "+ endDateFormat
  }else if(startDate.year() === endDate.year()) {
    // Different days, different months, same year
    date = startDate.format("D MMMM") + " - "+ endDateFormat
  }else{
    // Different days, different months, different years
    date = startDate.format("D MMMM YYYY") + " - "+ endDateFormat
  }

  return <IconText icon={<Event />} marginBottom={props.marginBottom}>
    {date}
  </IconText>
}