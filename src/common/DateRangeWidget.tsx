import { Event } from "@mui/icons-material"
import moment from "moment"
import IconText from "./IconText"

interface DateRangeWidgetProps {
  startDate: moment.MomentInput
  endDate: moment.MomentInput

  marginBottom?: string | number
}

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