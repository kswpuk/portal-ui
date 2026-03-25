import moment from "moment"

import { EventAvailable, EventBusy } from "@mui/icons-material";
import IconText from "./IconText";

interface DeadlineWidgetProps {
  /** The registration deadline date/time. Accepts any value that moment can parse. */
  deadline: moment.MomentInput
  /** Bottom margin passed through to the underlying `IconText`. */
  marginBottom?: string | number
}

/**
 * Displays a registration deadline as an icon + text row.
 *
 * Shows "Register before D MMMM YYYY" when the deadline is today or in the
 * future, or "Registration closed" (with a different icon) once it has passed.
 */
export default function DeadlineWidget(props: DeadlineWidgetProps){
  const registrationDate = moment(props.deadline)
  const now = moment()

  const registrationClosed = registrationDate.isBefore(now, 'day');

  if(registrationClosed) {
    return <IconText icon={<EventBusy />} marginBottom={props.marginBottom}>
      Registration closed
    </IconText>
  } else {
    return <IconText icon={<EventAvailable />} marginBottom={props.marginBottom}>
      Register before {registrationDate.format("D MMMM YYYY")}
    </IconText>
  }
}