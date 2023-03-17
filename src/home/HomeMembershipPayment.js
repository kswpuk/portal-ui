import { Alert, Button, Card, CardActions, CardContent, CardHeader, Link as MUILink, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from './HomeMembershipPayment.module.css'

export default function HomeMembershipPayment(props) {
  const active = props.member.status === "ACTIVE"
  const expires = new Date(props.member.membershipExpires)
  
  if(active){
    const prePaymentDate = new Date(expires)
    prePaymentDate.setDate(prePaymentDate.getDate() - 30)

    const canPayNow = prePaymentDate < new Date()

    return <Card>
    <CardHeader title="Active Member" />
    <CardContent>
      <Typography variant="body2">Your membership expires on <strong>{expires.toLocaleDateString('en-gb', { year:"numeric", month:"long", day: "numeric"})}</strong>.</Typography>
      {canPayNow ? <Alert severity="info" sx={{marginTop: '1rem'}}>You can <MUILink component={Link} to={"/user/pay"}>pay your membership</MUILink> up to 1 month early to avoid becoming an inactive member.</Alert> : null }
    </CardContent>
    {canPayNow ? <CardActions>
      <Button component={Link} to="/user/pay">Pay my Membership</Button>
    </CardActions> : null}
  </Card>
  }else{  
    const deleted = new Date(expires)
    deleted.setDate(deleted.getDate() + 730)

    return <Card className={styles.inactive}>
    <CardHeader title="Inactive Member" />
    <CardContent>
      <Typography variant="body2" gutterBottom>
        You are currently an inactive member.
        This means your membership has lapsed, and you are no longer able to attend KSWP events.
        You can reactivate your membership by <MUILink component={Link} to={"/user/pay"}>paying your annual membership fee</MUILink>.
      </Typography>
      <Typography variant="body2">
        After 2 years as an inactive member, your account will be deleted and you will need to reapply to join the KSWP if you wish to renew your membership.
        Your account will be deleted on <strong>{deleted.toLocaleDateString('en-gb', { year:"numeric", month:"long", day: "numeric"})}</strong> unless you renew your membership.
      </Typography>
    </CardContent>
    
    <CardActions>
      <Button component={Link} to="/user/pay">Pay my Membership</Button>
    </CardActions>
  </Card>
}
  }

