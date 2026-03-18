import moment from "moment"

import { EventAvailable, EventBusy } from "@mui/icons-material";
import IconText from "./IconText";

interface DeadlineWidgetProps {
  deadline: moment.MomentInput

  marginBottom?: string | number
}

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