import { Alert, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Link as MUILink, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MemberPhoto from "../common/MemberPhoto";
import {committeeRoles} from '../consts'

export default function HomeMembershipDetails(props) {
  const name = (props.member.preferredName || props.member.firstName) + " " + props.member.surname

  const now = new Date().getTime() / 1000
  const detailsWarningCutoff = now - (60*60*24*30*6)  // 6 months
  const detailsErrorCutoff = now - (60*60*24*30*12)  // 12 months

  const dateStr = new Date(props.member.lastUpdated * 1000).toLocaleDateString('en-gb', { year:"numeric", month:"long", day: "numeric"})

  let details = null
  if(detailsErrorCutoff > props.member.lastUpdated) {
    details = <Alert severity="error">
      You last updated your details more than a year ago, on <strong>{dateStr}</strong>.
      Please <MUILink component={Link} to={"/user"}>check them now</MUILink> and confirm they are still correct.
    </Alert>
  } else if(detailsWarningCutoff > props.member.lastUpdated) {
    details = <Alert severity="warning">
      You last updated your details more than 6 months ago, on <strong>{dateStr}</strong>.
      Please <MUILink component={Link} to={"/user"}>check them now</MUILink> and confirm they are still correct.
    </Alert>
  } else {
    details = <Typography variant="body2">You last updated your details on <strong>{dateStr}</strong>.</Typography>
  }

  return <Card>
    <CardHeader title={name} subheader={committeeRoles[props.member.role]?.name || "Member"} />
    <CardMedia component={() => 
      <MemberPhoto membershipNumber={props.member.membershipNumber}
        width={250}
        alt={name} />}
      />
    <CardContent>
      {details}
    </CardContent>
    <CardActions>
      <Button component={Link} to="/user">Update My Details</Button>
      <Button component={Link} to="/user/photo">Update My Photo</Button>
    </CardActions>
  </Card>
}