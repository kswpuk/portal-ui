import moment from "moment"

import { EventAvailable, EventBusy } from "@mui/icons-material";
import IconText from "./IconText";

export default function DeadlineWidget(props){
  const registrationDate = new moment(props.deadline)
  const now = new moment()

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