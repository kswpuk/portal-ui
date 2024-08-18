import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import MemberPhoto from '../common/MemberPhoto';
import Privileged from '../common/Privileged';
import { Link } from "react-router-dom";

export default function MemberCard(props){
  if (!props.membershipNumber) {
    return null
  }

  return <Card variant='outlined'>
    <CardHeader title={props.name || props.membershipNumber} subheader={props.name ? props.membershipNumber : null} />
    <CardContent>
      <MemberPhoto membershipNumber={props.membershipNumber} title={props.name || props.membershipNumber}/>
    </CardContent>
    <Privileged allowed={["COMMITTEE"]}>
      <CardActions>
        <Button component={Link} to={`/members/${props.membershipNumber}/view`}>View Member</Button>
      </CardActions>
    </Privileged>
  </Card>
}