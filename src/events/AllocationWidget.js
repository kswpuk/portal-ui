import { Person, PersonOutline } from "@mui/icons-material";
import IconText from "../common/IconText";
import { ALLOCATED, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts";

export default function AllocationWidget(props){
  const allocationText = getAllocationText(props.allocation, props.verbose)

  return props.textOnly ? allocationText : <IconText icon={allocationText == null ? <PersonOutline /> : <Person />} marginBottom={props.marginBottom} gap={props.gap}>
    {allocationText == null ? (props.verbose ? "You have not responded to this event" : "Not responded") : allocationText}
  </IconText>
}

export function getAllocationText(allocation, verbose=false){
  switch(allocation){
    case REGISTERED:
      return verbose ? "You are registered for this event" : "Registered"
    case ALLOCATED:
      return verbose ? "You are allocated to this event" : "Allocated"
    case ATTENDED:
      return verbose ? "You attended this event" : "Attended"
    case NOT_ALLOCATED:
      return verbose ? "You are not allocated to this event" : "Not allocated"
    case RESERVE:
      return verbose ? "You are on the reserve list for this event" : "Reserve list"
    case DROPPED_OUT:
      return verbose ? "You dropped out of this event" : "Dropped out"
    case NO_SHOW:
      return verbose ? "You were allocated to this event but did not show up" : "Did not show"
    default:
      return null
  }
}