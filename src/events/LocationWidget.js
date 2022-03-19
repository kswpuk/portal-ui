import { Computer, LocationOn } from "@mui/icons-material";
import { Link } from "@mui/material";
import IconText from "../common/IconText";

export default function LocationWidget(props){

  switch(props.event.locationType){
    case "virtual":
      return <IconText icon={<Computer />} marginBottom={props.marginBottom} gap={props.gap}>
        {props.event.url ? <Link href={props.event.url} target="_blank">
          {props.event.location}
        </Link> : props.event.location}
      </IconText>
    case "physical":
    default:
      return <IconText icon={<LocationOn />} marginBottom={props.marginBottom} gap={props.gap}>
        <Link href={"https://www.google.com/maps/search/?api=1&query="+props.event.postcode} target="_blank">
          {props.event.location}, {props.event.postcode}
        </Link>
      </IconText>
  }
}